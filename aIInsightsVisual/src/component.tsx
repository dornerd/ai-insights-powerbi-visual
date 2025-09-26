import * as React from "react";

export interface AIInsight {
    id: number;
    question: string;
    answer: string;
}

export interface AIInsightsProps {
    insights: AIInsight[];
    isLoading: boolean;
    error?: string;
    onGenerateInsights?: (customQuestions?: string) => void;
    showGenerateButton?: boolean;
    styling?: {
        cardBackgroundColor?: string;
        cardHeaderColor?: string;
        textColor?: string;
        cardSpacing?: number;
    };
}

export class AIInsightsComponent extends React.Component<AIInsightsProps, { prompt: string }> {
    constructor(props: AIInsightsProps) {
        super(props);
        this.state = { prompt: "" };
    }

    render() {
        const { insights, isLoading, error, onGenerateInsights, showGenerateButton, styling } = this.props;

        if (error) {
            return (
                <div className="ai-insights-container error">
                    <div className="error-message">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="ai-insights-container loading">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Generating AI insights...</p>
                    </div>
                </div>
            );
        }

        if (!insights || insights.length === 0) {
            return (
                <div className="ai-insights-container empty">
                    <div className="empty-message">
                        <h3>No Data</h3>
                        <p>Please add measures and categories to generate insights.</p>
                        {showGenerateButton && onGenerateInsights && (
                            <button 
                                className="generate-button" 
                                onClick={() => onGenerateInsights()}
                                disabled={isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate Insights"}
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        const cardSpacing = styling?.cardSpacing || 20;
        const cardBackgroundColor = styling?.cardBackgroundColor || '#ffffff';
        const cardHeaderColor = styling?.cardHeaderColor || '#4facfe';
        const textColor = styling?.textColor || '#333333';

        return (
            <div className="ai-insights-container">
                <div className="insights-header">
                    <h2>AI Data Insights</h2>
                    <p>Generated insights from your data</p>
                    {showGenerateButton && onGenerateInsights && (
                        <div>
                            <div style={{ marginBottom: 10 }}>
                                <textarea
                                    value={this.state.prompt}
                                    onChange={(e) => this.setState({ prompt: (e.target as HTMLTextAreaElement).value })}
                                    placeholder="Type your questions here (one per line)"
                                    style={{ width: '100%', maxWidth: 600, height: 80, padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.4)' }}
                                />
                            </div>
                            <button 
                                className="generate-button" 
                                onClick={() => onGenerateInsights(this.state.prompt)}
                                disabled={isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate New Insights"}
                            </button>
                        </div>
                    )}
                </div>
                <div className="insights-grid" style={{ gap: `${cardSpacing}px` }}>
                    {insights.map((insight) => (
                        <div key={insight.id} className="insight-card" style={{ backgroundColor: cardBackgroundColor }}>
                            <div className="card-header" style={{ backgroundColor: cardHeaderColor }}>
                                <span className="question-number">Q{insight.id}</span>
                                <h3 className="question-title">{insight.question}</h3>
                            </div>
                            <div className="card-content">
                                <p className="answer-text" style={{ color: textColor }}>{insight.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default AIInsightsComponent;
