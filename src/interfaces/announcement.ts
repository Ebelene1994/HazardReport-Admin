import { LocationData } from '../context/DashboardContext';

export interface CreateAnnouncementData {
    title: string;
    detail: string;
    category: 'Alert' | 'Info' | 'Update';
    status: 'Pinned' | 'Active' | 'Archived';
    pinToFeed: boolean;
    location?: LocationData;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {
    keepAttachments?: boolean;
}