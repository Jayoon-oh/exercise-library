class HistoryModel {
    id: number;
    userEmail: string;
    startDate: string;
    completedDate: string;
    title: string;
    source: string;
    description: string;
    img: string;

    constructor(id: number, userEmail: string, startDate: string, completedDate: string, title: string,
        source: string, description: string, img: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.startDate = startDate;
        this.completedDate = completedDate;
        this.title = title;
        this.source = source;
        this.description = description;
        this.img = img;
    }
}

export default HistoryModel;