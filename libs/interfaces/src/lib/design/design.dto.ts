export class Design {
    designId: string; 
    userId: string;
    title?: string;
    
    constructor(designId: string, userId: string, title?: string) {
        this.designId = designId
        this.userId = userId
        this.title = title || 'Untitled'
    }
}
