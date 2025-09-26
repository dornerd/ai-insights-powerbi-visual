import powerbi from "powerbi-visuals-api";

export interface ProcessedData {
    category1Data: string[];
    category2Data: string[];
    measuresData: number[];
    measureNames?: string[];  // Make optional
    rawData: any[];
}

export interface AIRequest {
    data: ProcessedData;
    questions: string[];
    numberOfQuestions: number;
}

export class DataProcessor {
    public static processDataView(dataView: powerbi.DataView): ProcessedData | null {
        if (!dataView || !dataView.categorical) {
            return null;
        }

        const categorical = dataView.categorical;
        
        // Debug logging to see what PowerBI is sending
        console.log('🔍 === PowerBI Data Debug ===');
        console.log('📊 Full dataView:', JSON.stringify(dataView, null, 2));
        console.log('📊 Categorical structure:', JSON.stringify(categorical, null, 2));
        console.log('📊 Values array length:', categorical.values ? categorical.values.length : 'undefined');
        if (categorical.values) {
            categorical.values.forEach((valueGroup, index) => {
                console.log(`📊 Value group ${index}:`, {
                    source: valueGroup.source,
                    values: valueGroup.values,
                    valuesLength: valueGroup.values ? valueGroup.values.length : 'undefined'
                });
            });
        }
        
        // Check for other data structures that might contain measures
        console.log('📊 DataView metadata:', dataView.metadata);
        console.log('📊 DataView single:', dataView.single);
        console.log('📊 DataView table:', dataView.table);
        console.log('📊 DataView matrix:', dataView.matrix);
        console.log('=====================================');
        const category1Data: string[] = [];
        const category2Data: string[] = [];
        const measuresData: number[] = [];
        const measureNames: string[] = [];
        const rawData: any[] = [];

        // Process Category 1
        if (categorical.categories && categorical.categories.length > 0) {
            const category1 = categorical.categories[0];
            if (category1.values) {
                category1Data.push(...category1.values.map(v => String(v)));
            }
        }

        // Process Category 2 (if available)
        if (categorical.categories && categorical.categories.length > 1) {
            const category2 = categorical.categories[1];
            if (category2.values) {
                category2Data.push(...category2.values.map(v => String(v)));
            }
        }

        // Process Measures - Handle multiple measures
        if (categorical.values && categorical.values.length > 0) {
            for (const measureGroup of categorical.values) {
                if (measureGroup.values) {
                    // Get measure name from source
                    const measureName = measureGroup.source?.displayName || measureGroup.source?.queryName || 'Unknown Measure';
                    measureNames.push(measureName);
                    
                    // Add all values for this measure
                    measuresData.push(...measureGroup.values.map(v => Number(v)));
                }
            }
        }
        
        // Alternative approach: Check if there are multiple measures in a single group
        // This might happen if PowerBI groups multiple measures together
        if (categorical.values && categorical.values.length > 0) {
            const firstValueGroup = categorical.values[0];
            if (firstValueGroup.source && firstValueGroup.source.roles) {
                // Check if this is a multi-measure scenario
                console.log('🔍 === Multi-measure check ===');
                console.log('📊 Source roles:', firstValueGroup.source.roles);
                console.log('📊 Source displayName:', firstValueGroup.source.displayName);
                console.log('📊 Source queryName:', firstValueGroup.source.queryName);
                console.log('=====================================');
            }
        }
        
        // If no measure names were found, create default names
        if (measureNames.length === 0 && measuresData.length > 0) {
            measureNames.push('Measure');
        }
        
        // Debug logging after processing
        console.log('🔍 === After Processing Debug ===');
        console.log('📊 Processed measureNames:', measureNames);
        console.log('📊 Processed measuresData:', measuresData);
        console.log('📊 Processed measuresData length:', measuresData.length);
        console.log('📊 Number of measure groups:', categorical.values ? categorical.values.length : 0);
        if (categorical.values) {
            categorical.values.forEach((group, index) => {
                console.log(`📊 Measure group ${index}:`, {
                    source: group.source,
                    valuesCount: group.values ? group.values.length : 0,
                    values: group.values
                });
            });
        }
        console.log('=====================================');

        // Create raw data for AI processing
        // Handle multiple measures properly by creating data points for each measure
        const maxCategoryLength = Math.max(category1Data.length, category2Data.length);
        
        if (categorical.values && categorical.values.length > 0) {
            // Process each measure group separately
            for (let measureGroupIndex = 0; measureGroupIndex < categorical.values.length; measureGroupIndex++) {
                const measureGroup = categorical.values[measureGroupIndex];
                if (measureGroup.values) {
                    const measureName = measureGroup.source?.displayName || measureGroup.source?.queryName || `Measure ${measureGroupIndex + 1}`;
                    
                    // Create data points for this measure
                    for (let i = 0; i < measureGroup.values.length; i++) {
                        rawData.push({
                            category1: category1Data[i] || 'N/A',
                            category2: category2Data[i] || 'N/A',
                            measure: Number(measureGroup.values[i]) || 0,
                            measureName: measureName
                        });
                    }
                }
            }
        } else {
            // Fallback: create data points from flattened measures data
            const maxLength = Math.max(category1Data.length, category2Data.length, measuresData.length);
            for (let i = 0; i < maxLength; i++) {
                let measureName = 'Measure';
                if (measureNames.length > 0) {
                    const measureIndex = Math.floor(i / (maxLength / measureNames.length));
                    measureName = measureNames[measureIndex] || 'Measure';
                }
                
                rawData.push({
                    category1: category1Data[i] || 'N/A',
                    category2: category2Data[i] || 'N/A',
                    measure: measuresData[i] || 0,
                    measureName: measureName
                });
            }
        }

        return {
            category1Data,
            category2Data,
            measuresData,
            measureNames,
            rawData
        };
    }

    public static createAIRequest(processedData: ProcessedData, customQuestions?: string, numberOfQuestions?: number): AIRequest {
        let questions: string[];
        
        if (customQuestions && customQuestions.trim()) {
            // Use custom questions, split by newlines and filter empty ones
            questions = customQuestions.split('\n')
                .map(q => q.trim())
                .filter(q => q.length > 0);
        } else {
            // Use default questions
            questions = [
                "What are the key trends in this data?",
                "What insights can you derive from the relationship between the categories and measures?",
                "Are there any notable patterns or outliers in the data?",
                "What recommendations would you make based on this data?",
                "How do the different categories compare to each other?",
                "What business implications can be drawn from this analysis?"
            ];
        }

        // Limit to the specified number of questions
        const questionCount = numberOfQuestions || 6;
        questions = questions.slice(0, questionCount);

        return {
            data: processedData,
            questions,
            numberOfQuestions: questionCount
        };
    }

    public static formatDataForAI(data: ProcessedData): string {
        let formattedData = "Data Analysis Request:\n\n";
        
        formattedData += "Category 1 Values: " + data.category1Data.join(", ") + "\n";
        formattedData += "Category 2 Values: " + data.category2Data.join(", ") + "\n";
        if (data.measureNames && data.measureNames.length > 0) {
            formattedData += "Measure Names: " + data.measureNames.join(", ") + "\n";
        }
        formattedData += "Measure Values: " + data.measuresData.join(", ") + "\n\n";
        
        formattedData += "Detailed Data Points:\n";
        data.rawData.forEach((item, index) => {
            formattedData += `${index + 1}. Category 1: ${item.category1}, Category 2: ${item.category2}, ${item.measureName}: ${item.measure}\n`;
        });

        return formattedData;
    }
}
