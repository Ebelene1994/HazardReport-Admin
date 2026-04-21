import { Report } from './report';
import { Announcement } from './announcement';
import { User, UserProfile } from './user';

export interface DashboardContextType {
    reports: Report[];
    announcements: Announcement[];
    users: User[];
    userProfile: UserProfile;
    addReport: (report: Omit<Report, 'id' | 'date' | 'time'>) => Report;
    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'time'>) => Announcement;
    updateReport: (id: string, updates: Partial<Report>) => void;
    updateAnnouncement: (id: number, updates: Partial<Announcement>) => void;
    deleteReport: (id: string) => void;
    deleteAnnouncement: (id: number) => void;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    refreshData: () => Promise<void>;
    refreshUsers: () => Promise<void>;
    updateUser: (id: string, updates: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    isLoading: boolean;
    isLoadingUsers: boolean;
}
