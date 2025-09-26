/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { AIInsightsComponent, AIInsight } from "./component";
import { DataProcessor } from "./dataProcessor";
import { AIService } from "./aiService";

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private reactRoot: React.ReactElement;
    private insights: AIInsight[] = [];
    private isLoading: boolean = false;
    private error: string | undefined;
    private lastProcessedData: any = null;
    private shouldGenerate: boolean = false;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        
        // Initialize with default insights
        this.insights = AIService.getDefaultInsights();
        this.render();
    }

    public async update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews.length > 0) {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
        }

        console.log('Visual update', options);
        console.log('🔧 Settings after update:', {
            formattingSettings: this.formattingSettings,
            debugMode: this.formattingSettings?.dataPointCard?.debugMode?.value
        });
        
        if (options.dataViews && options.dataViews.length > 0) {
            const dataView = options.dataViews[0];
            const processedData = DataProcessor.processDataView(dataView);
            
            if (processedData) {
                this.lastProcessedData = processedData;
                
                // Check if generate button was clicked
                if (this.formattingSettings?.dataPointCard?.generateButton?.value) {
                    this.formattingSettings.dataPointCard.generateButton.value = false; // Reset the button
                    await this.generateInsights(processedData);
                } else {
                    // Show placeholder insights - user can click generate button
                    this.insights = this.getPlaceholderInsights();
                    this.error = undefined;
                    this.render();
                }
            } else {
                this.insights = AIService.getDefaultInsights();
                this.error = undefined;
                this.render();
            }
        } else {
            this.insights = AIService.getDefaultInsights();
            this.error = undefined;
            this.render();
        }
    }

    private async generateInsights(processedData: any, customQuestions?: string) {
        this.isLoading = true;
        this.error = undefined;
        this.render();

        try {
            const numberOfQuestions = this.formattingSettings?.dataPointCard?.fontSize?.value || 6;
            // Try multiple ways to get the debug mode setting
            let debugMode = false;
            if (this.formattingSettings?.dataPointCard?.debugMode) {
                debugMode = this.formattingSettings.dataPointCard.debugMode.value || false;
            }
            
            // Fallback: check if the setting exists but might not be properly initialized
            if (this.formattingSettings?.dataPointCard && 'debugMode' in this.formattingSettings.dataPointCard) {
                const debugSetting = (this.formattingSettings.dataPointCard as any).debugMode;
                if (debugSetting && typeof debugSetting.value === 'boolean') {
                    debugMode = debugSetting.value;
                }
            }
            
            // Debug logging to see what's happening with the settings
            console.log('🔧 Debug Mode Check:', {
                formattingSettings: this.formattingSettings,
                dataPointCard: this.formattingSettings?.dataPointCard,
                debugModeSetting: this.formattingSettings?.dataPointCard?.debugMode,
                debugModeValue: debugMode
            });
            
            // TEMPORARY: Force debug mode for testing (remove this line once issue is fixed)
            // debugMode = true;
            console.log('🔧 Final debug mode value:', debugMode);
            
            const aiRequest = DataProcessor.createAIRequest(processedData, customQuestions, numberOfQuestions);
            this.insights = await AIService.generateInsights(aiRequest, debugMode);
        } catch (error) {
            console.error('Error generating insights:', error);
            this.error = error instanceof Error ? error.message : 'Unknown error occurred';
            this.insights = this.getPlaceholderInsights();
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    private getPlaceholderInsights(): AIInsight[] {
        const numberOfQuestions = this.formattingSettings?.dataPointCard?.fontSize?.value || 6;
        
        const questions = [
            "What are the key trends in this data?",
            "What insights can you derive from the relationship between the categories and measures?",
            "Are there any notable patterns or outliers in the data?",
            "What recommendations would you make based on this data?",
            "How do the different categories compare to each other?",
            "What business implications can be drawn from this analysis?",
            "What are the most significant data points?",
            "How does this data compare to industry standards?",
            "What opportunities does this data reveal?",
            "What risks should be considered based on this data?"
        ];

        // Limit to the specified number of questions
        const selectedQuestions = questions.slice(0, numberOfQuestions);

        return selectedQuestions.map((question, index) => ({
            id: index + 1,
            question: question,
            answer: "Click 'Generate Insights' to get AI-powered analysis of your data."
        }));
    }

    private render() {
        const styling = {
            cardBackgroundColor: this.formattingSettings?.stylingCard?.cardBackgroundColor?.value?.value || '#ffffff',
            cardHeaderColor: this.formattingSettings?.stylingCard?.cardHeaderColor?.value?.value || '#4facfe',
            textColor: this.formattingSettings?.stylingCard?.textColor?.value?.value || '#333333',
            cardSpacing: 20 // Fixed spacing
        };

        this.reactRoot = React.createElement(AIInsightsComponent, {
            insights: this.insights,
            isLoading: this.isLoading,
            error: this.error,
            onGenerateInsights: (customQuestions?: string) => this.handleGenerateInsights(customQuestions),
            showGenerateButton: true,
            styling: styling
        });
        ReactDOM.render(this.reactRoot, this.target);
    }

    private handleGenerateInsights(customQuestions?: string) {
        if (this.lastProcessedData) {
            this.generateInsights(this.lastProcessedData, customQuestions);
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}