export default interface StudyQuestion {
    id: number;
    pdf_name: string;
    page_number: number;
    question: string;
    answer: string;
    options: string[];
};