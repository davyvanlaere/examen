export interface Answer {
    Id: string;
    Text: string;
}

export interface QuestionInfo {
    Id: number;
    Question: string;
    CorrectAnswer: string;
    SuppliedAnswer?: string;
    Result?: boolean;
    Answers: Answer[];
    TotalRemaining?: number;
    Total?: number;
}
