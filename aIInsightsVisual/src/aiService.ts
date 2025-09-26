import { AIRequest, ProcessedData } from "./dataProcessor";
import { AIInsight } from "./component";

export class AIService {
    private static readonly API_BASE_URL = "https://ai-insights-powerbi-visual.onrender.com"; // FastAPI backend URL

    public static async generateInsights(request: AIRequest, debugMode: boolean = false): Promise<AIInsight[]> {
        let debugInfo: any = null;
        
        try {
            if (debugMode) {
                debugInfo = {
                    timestamp: new Date().toISOString(),
                    apiEndpoint: `${this.API_BASE_URL}/generate-insights`,
                    requestHeaders: {
                        'Content-Type': 'application/json'
                    },
                    requestBody: request,
                    powerBIDataStructure: this.getPowerBIDataStructureInfo(request.data)
                };
                
                console.log('\n🔍 === DEBUG MODE: OpenAI Request ===');
                console.log('📅 Timestamp:', debugInfo.timestamp);
                console.log('🌐 API Endpoint:', debugInfo.apiEndpoint);
                console.log('📋 Request Headers:', debugInfo.requestHeaders);
                console.log('📦 Request Body:');
                console.log(JSON.stringify(debugInfo.requestBody, null, 2));
                console.log('\n🔍 === PowerBI Data Structure Analysis ===');
                console.log('📊 Category 1 Data Count:', debugInfo.powerBIDataStructure.category1DataCount);
                console.log('📊 Category 2 Data Count:', debugInfo.powerBIDataStructure.category2DataCount);
                console.log('📊 Measures Data Count:', debugInfo.powerBIDataStructure.measuresDataCount);
                console.log('📊 Measure Names Count:', debugInfo.powerBIDataStructure.measureNamesCount);
                console.log('📊 Raw Data Count:', debugInfo.powerBIDataStructure.rawDataCount);
                console.log('📊 Measure Names:', debugInfo.powerBIDataStructure.measureNames);
                console.log('📊 Measures Data:', debugInfo.powerBIDataStructure.measuresData);
                console.log('📊 Data Structure Analysis:');
                console.log('   - Has Multiple Measures:', debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMultipleMeasures);
                console.log('   - Has Measure Names:', debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMeasureNames);
                console.log('   - Has Multiple Categories:', debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMultipleCategories);
                console.log('   - Data Point Ratio:', debugInfo.powerBIDataStructure.dataStructureAnalysis.dataPointRatio);
                console.log('=====================================\n');
                
                // Create downloadable debug file
                this.createDownloadableDebugFile(debugInfo);
            }

            const response = await fetch(`${this.API_BASE_URL}/generate-insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (debugMode) {
                const headers: { [key: string]: string } = {};
                response.headers.forEach((value, key) => {
                    headers[key] = value;
                });
                
                console.log('🔍 === DEBUG MODE: OpenAI Response ===');
                console.log('📊 Response Status:', response.status);
                console.log('📋 Response Headers:', headers);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (debugMode) {
                console.log('📦 Response Body:');
                console.log(JSON.stringify(result, null, 2));
                console.log('=====================================\n');
                
                // Create downloadable response file with actual response data
                const responseHeaders: { [key: string]: string } = {};
                response.headers.forEach((value, key) => {
                    responseHeaders[key] = value;
                });
                
                this.createDownloadableResponseFile(result, response.status, responseHeaders);
                
                // Create comprehensive debug file with both request and response
                if (debugInfo) {
                    this.createComprehensiveDebugFile(debugInfo, result, response.status, responseHeaders);
                }
            }

            return result.insights || [];
        } catch (error) {
            console.error('Error generating AI insights:', error);
            throw new Error('Failed to generate AI insights. Please check if the FastAPI backend is running.');
        }
    }

    public static async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Error testing AI service connection:', error);
            return false;
        }
    }

    public static getDefaultInsights(): AIInsight[] {
        return [
            {
                id: 1,
                question: "What are the key trends in this data?",
                answer: "Please connect your data to generate AI-powered insights."
            },
            {
                id: 2,
                question: "What insights can you derive from the relationship between the categories and measures?",
                answer: "Add measures and categories to see AI analysis."
            },
            {
                id: 3,
                question: "Are there any notable patterns or outliers in the data?",
                answer: "Data analysis will appear here once you add your data."
            },
            {
                id: 4,
                question: "What recommendations would you make based on this data?",
                answer: "AI recommendations will be generated from your data."
            },
            {
                id: 5,
                question: "How do the different categories compare to each other?",
                answer: "Category comparisons will be analyzed by AI."
            },
            {
                id: 6,
                question: "What business implications can be drawn from this analysis?",
                answer: "Business insights will be provided based on your data."
            }
        ];
    }

    private static createDownloadableDebugFile(debugInfo: any) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `openai-request-${timestamp}.txt`;
            
            // Create formatted text content
            const textContent = `🔍 === DEBUG MODE: OpenAI Request ===
📅 Timestamp: ${debugInfo.timestamp}
🌐 API Endpoint: ${debugInfo.apiEndpoint}
📋 Request Headers: ${JSON.stringify(debugInfo.requestHeaders, null, 2)}
📦 Request Body:
${JSON.stringify(debugInfo.requestBody, null, 2)}
=====================================`;
            
            // Create a downloadable file
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`💾 Debug info downloaded as: ${filename}`);
        } catch (error) {
            console.warn('⚠️ Could not create downloadable debug file:', error);
        }
    }

    private static createDownloadableResponseFile(response: any, status: number = 200, headers: { [key: string]: string } = {}) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `openai-response-${timestamp}.txt`;
            
            // Create formatted text content
            const textContent = `🔍 === DEBUG MODE: OpenAI Response ===
📊 Response Status: ${status}
📋 Response Headers: ${JSON.stringify(headers, null, 2)}
📦 Response Body:
${JSON.stringify(response, null, 2)}
=====================================`;
            
            // Create a downloadable file
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`💾 Response downloaded as: ${filename}`);
        } catch (error) {
            console.warn('⚠️ Could not create downloadable response file:', error);
        }
    }

    private static getPowerBIDataStructureInfo(data: any): any {
        return {
            category1DataCount: data.category1Data ? data.category1Data.length : 0,
            category2DataCount: data.category2Data ? data.category2Data.length : 0,
            measuresDataCount: data.measuresData ? data.measuresData.length : 0,
            measureNamesCount: data.measureNames ? data.measureNames.length : 0,
            rawDataCount: data.rawData ? data.rawData.length : 0,
            measureNames: data.measureNames || [],
            measuresData: data.measuresData || [],
            category1Data: data.category1Data || [],
            category2Data: data.category2Data || [],
            rawDataSample: data.rawData ? data.rawData.slice(0, 3) : [], // First 3 items
            dataStructureAnalysis: {
                hasMultipleMeasures: data.measuresData && data.measuresData.length > 1,
                hasMeasureNames: data.measureNames && data.measureNames.length > 0,
                hasMultipleCategories: data.category1Data && data.category2Data && 
                                    data.category1Data.length > 0 && data.category2Data.length > 0,
                dataPointRatio: data.rawData && data.measuresData ? 
                              data.rawData.length / data.measuresData.length : 0
            }
        };
    }

    private static createComprehensiveDebugFile(debugInfo: any, response: any, status: number, headers: { [key: string]: string }) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `openai-debug-complete-${timestamp}.txt`;
            
            // Create comprehensive formatted text content
            const textContent = `🔍 === DEBUG MODE: OpenAI Request ===
📅 Timestamp: ${debugInfo.timestamp}
🌐 API Endpoint: ${debugInfo.apiEndpoint}
📋 Request Headers: ${JSON.stringify(debugInfo.requestHeaders, null, 2)}
📦 Request Body:
${JSON.stringify(debugInfo.requestBody, null, 2)}
=====================================

🔍 === PowerBI Data Structure Analysis ===
📊 Category 1 Data Count: ${debugInfo.powerBIDataStructure.category1DataCount}
📊 Category 2 Data Count: ${debugInfo.powerBIDataStructure.category2DataCount}
📊 Measures Data Count: ${debugInfo.powerBIDataStructure.measuresDataCount}
📊 Measure Names Count: ${debugInfo.powerBIDataStructure.measureNamesCount}
📊 Raw Data Count: ${debugInfo.powerBIDataStructure.rawDataCount}
📊 Measure Names: ${JSON.stringify(debugInfo.powerBIDataStructure.measureNames, null, 2)}
📊 Measures Data: ${JSON.stringify(debugInfo.powerBIDataStructure.measuresData, null, 2)}
📊 Category 1 Data: ${JSON.stringify(debugInfo.powerBIDataStructure.category1Data, null, 2)}
📊 Category 2 Data: ${JSON.stringify(debugInfo.powerBIDataStructure.category2Data, null, 2)}
📊 Raw Data Sample (first 3): ${JSON.stringify(debugInfo.powerBIDataStructure.rawDataSample, null, 2)}
📊 Data Structure Analysis:
   - Has Multiple Measures: ${debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMultipleMeasures}
   - Has Measure Names: ${debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMeasureNames}
   - Has Multiple Categories: ${debugInfo.powerBIDataStructure.dataStructureAnalysis.hasMultipleCategories}
   - Data Point Ratio: ${debugInfo.powerBIDataStructure.dataStructureAnalysis.dataPointRatio}
=====================================

🔍 === DEBUG MODE: OpenAI Response ===
📊 Response Status: ${status}
📋 Response Headers: ${JSON.stringify(headers, null, 2)}
📦 Response Body:
${JSON.stringify(response, null, 2)}
=====================================`;
            
            // Create a downloadable file
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`💾 Complete debug info downloaded as: ${filename}`);
        } catch (error) {
            console.warn('⚠️ Could not create comprehensive debug file:', error);
        }
    }
}
