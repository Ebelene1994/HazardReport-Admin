import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiGetAdminProfile } from '../services/auth';
import { baseUrl } from '../services/config';
import { apiGetAllReports } from '../services/reports';
import { userApi, BackendUser } from '../services/userApi';

export interface Attachment {
    url: string;
    filename: string;
    publicId: string;
    format: string;
}

export interface LocationData {
    text: string;
    city?: string;
    country?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    reports: number;
    status: 'Active' | 'Pending' | 'Suspended';
    role: 'admin' | 'user';
    avatar?: string;
    address?: string;
    lastActive?: string;
}

export interface Report {
    id: string;
    title: string;
    location: string;
    name: string;
    date: string;
    time: string;
    status: string;
    category: string;
    attachmentName?: string;
    attachmentUrl?: string;
    locationData?: LocationData;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    reportType?: 'report' | 'announcement';
    announcementId?: number;
}

export interface Announcement {
    id: number;
    title: string;
    detail: string;
    date: string;
    time: string;
    category: string;
    status: string;
    location?: LocationData;
    attachments?: Attachment[];
}

interface DashboardContextType {
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

const INITIAL_REPORTS: Report[] = [
    {
        id: '#dg6879',
        title: 'Severe Flooding',
        category: 'Floods',
        location: 'Accra Central, Market sq.',
        name: 'Ama Boateng',
        date: 'Oct 24, 2026',
        time: '13:28',
        status: 'Confirmed',
        locationData: { text: 'Accra Central, Market sq.', city: 'Accra', country: 'Ghana' }
    },
    {
        id: '#dg3456',
        title: 'Downed Powerline',
        category: 'Others',
        location: 'Kumasi, Kejetia Market sq.',
        name: 'Ama Boateng',
        date: 'Sep 23, 2026',
        time: '20:22',
        status: 'Active',
        locationData: { text: 'Kumasi, Kejetia Market sq.', city: 'Kumasi', country: 'Ghana' }
    },
    {
        id: '#dg1234',
        title: 'Massive Potholes',
        category: 'Others',
        location: 'Accra Central, Market sq.',
        name: 'Admin',
        date: 'Aug 10, 2026',
        time: '12:56',
        status: 'Pending',
        locationData: { text: 'Accra Central, Market sq.', city: 'Accra', country: 'Ghana' }
    },
    {
        id: '#dg5678',
        title: 'False Fire Alarm',
        category: 'Wildfire',
        location: 'Mole National Park',
        name: 'Ama Boateng',
        date: 'Jun 21, 2026',
        time: '19:00',
        status: 'Spam',
        locationData: { text: 'Mole National Park', city: 'Mole', country: 'Ghana' }
    },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 1,
        title: 'Flood warning: Volta region',
        detail: 'Immediate precaution advised for all residents in the Volta region due to rising water levels.',
        date: 'Oct 12, 2023',
        time: '12:23 PM',
        category: 'Alert',
        status: 'Pinned',
        location: { text: 'Volta Region, Ghana' }
    },
    {
        id: 2,
        title: 'New Reporting Guidelines',
        detail: 'We have updated how you can report hazards to ensure faster response times.',
        date: 'Oct 12, 2023',
        time: '12:23 PM',
        category: 'Info',
        status: 'Active'
    },
    {
        id: 3,
        title: 'Scheduled Maintenance',
        detail: 'System will be down for 2 hours for scheduled maintenance and upgrades.',
        date: 'Oct 12, 2023',
        time: '12:23 PM',
        category: 'Update',
        status: 'Archived'
    },
    {
        id: 4,
        title: 'Pothole repairs at Madina',
        detail: 'Road blocked from Monday to Friday for pothole repairs. Use alternate routes.',
        date: 'Oct 12, 2023',
        time: '12:23 PM',
        category: 'Info',
        status: 'Active',
        location: { text: 'Madina, Accra' }
    },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const loadUserProfileFromStorage = (): UserProfile => {
    const DEFAULT_PROFILE: UserProfile = {
        name: "Admin User",
        email: "admin@ghhazard.com",
        phone: "+233 00 000 0000",
        avatar: "",
    };

    const stored = localStorage.getItem("adminProfile");
    if (stored) {
        try {
            const admin = JSON.parse(stored);
            return {
                name: admin.userName || DEFAULT_PROFILE.name,
                email: admin.email || DEFAULT_PROFILE.email,
                phone: admin.phoneNumber || DEFAULT_PROFILE.phone,
                avatar: admin.avatar || DEFAULT_PROFILE.avatar,
            };
        } catch (e) {
            console.error("Failed to parse admin profile", e);
        }
    }
    return DEFAULT_PROFILE;
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
    const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
    const [users, setUsers] = useState<User[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfileFromStorage());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

    const refreshData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoading(true);
        try {
            const [reportsRes, profileRes] = await Promise.allSettled([
                apiGetAllReports(),
                apiGetAdminProfile()
            ]);

            if (reportsRes.status === 'fulfilled' && reportsRes.value.data?.hazardReports) {
                const formattedReports: Report[] = reportsRes.value.data.hazardReports.map((r: any) => ({
                    id: r._id,
                    title: r.title || r.hazardtype,
                    location: r.location || `${r.city}, ${r.country}`,
                    name: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() || r.user.userName : "Unknown",
                    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: r.status,
                    category: r.hazardtype,
                    attachmentUrl: r.images && r.images.length > 0 ? (r.images[0].startsWith('http') ? r.images[0] : `${baseUrl}/${r.images[0]}`) : undefined,
                    locationData: { text: r.location, city: r.city, country: r.country }
                }));
                setReports(formattedReports);
            }

            if (profileRes.status === 'fulfilled' && profileRes.value.data?.admin) {
                const admin = profileRes.value.data.admin;
                const newProfile = {
                    name: admin.userName || "Admin User",
                    email: admin.email || "",
                    phone: admin.phoneNumber || "",
                    avatar: admin.avatar ? (admin.avatar.startsWith('http') ? admin.avatar : `${baseUrl}/${admin.avatar}`) : "",
                };
                setUserProfile(newProfile);
                localStorage.setItem("adminProfile", JSON.stringify(admin));
            }
        } catch (error) {
            console.error("Error refreshing dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                await refreshData();
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        };
        loadData();
    }, []);

    const generateDate = () => {
        const d = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const generateTime = () => {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const addReport = (report: Omit<Report, 'id' | 'date' | 'time'>): Report => {
        const newReport: Report = {
            ...report,
            id: `#dg${Math.floor(1000 + Math.random() * 9000)}`,
            date: generateDate(),
            time: generateTime(),
        };
        setReports(prev => [newReport, ...prev]);
        return newReport;
    };

    const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date' | 'time'>): Announcement => {
        const newAnnouncement: Announcement = {
            ...announcement,
            id: Date.now(),
            date: generateDate(),
            time: generateTime(),
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        return newAnnouncement;
    };

    const updateReport = (id: string, updates: Partial<Report>) => {
        setReports(prev => prev.map(report =>
            report.id === id ? { ...report, ...updates } : report
        ));
    };

    const updateAnnouncement = (id: number, updates: Partial<Announcement>) => {
        setAnnouncements(prev => prev.map(announcement =>
            announcement.id === id ? { ...announcement, ...updates } : announcement
        ));
    };

    const deleteReport = (id: string) => {
        setReports(prev => prev.filter(report => report.id !== id));
    };

    const deleteAnnouncement = (id: number) => {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    };

    const updateUserProfile = (updates: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...updates }));
    };

    const mapBackendUser = (backendUser: BackendUser): User => {
        const createdAt = backendUser.createdAt ? new Date(backendUser.createdAt) : new Date();
        const isActive = backendUser.isActive ?? true;
        const isVerified = backendUser.isVerified ?? false;
        
        let status: 'Active' | 'Pending' | 'Suspended' = 'Active';
        if (!isActive) {
            status = 'Suspended';
        } else if (!isVerified) {
            status = 'Pending';
        }

        return {
            id: backendUser._id,
            name: backendUser.userName,
            email: backendUser.email,
            phone: backendUser.phoneNumber,
            date: createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reports: backendUser.reportsCount || 0,
            status,
            role: backendUser.role || 'user',
            avatar: backendUser.avatar ? (backendUser.avatar.startsWith('http') ? backendUser.avatar : `${baseUrl}/${backendUser.avatar}`) : undefined,
            address: undefined,
            lastActive: undefined,
        };
    };

    const refreshUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoadingUsers(true);
        try {
            const backendUsers = await userApi.getAllUsers();
            if (!Array.isArray(backendUsers)) return;
            const mappedUsers = backendUsers.map(mapBackendUser);
            setUsers(mappedUsers);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const updateUser = async (id: string, updates: Partial<User>) => {
        try {
            const backendUpdates: Parameters<typeof userApi.updateUser>[1] = {};
            if (updates.name) backendUpdates.userName = updates.name;
            if (updates.email) backendUpdates.email = updates.email;
            if (updates.phone) backendUpdates.phoneNumber = updates.phone;
            if (updates.status) {
                backendUpdates.isActive = updates.status !== 'Suspended';
                backendUpdates.isVerified = updates.status !== 'Pending';
            }

            await userApi.updateUser(id, backendUpdates);
            await refreshUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await userApi.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    };

    return (
        <DashboardContext.Provider value={{
            reports,
            announcements,
            users,
            userProfile,
            addReport,
            addAnnouncement,
            updateReport,
            updateAnnouncement,
            deleteReport,
            deleteAnnouncement,
            updateUserProfile,
            refreshData,
            refreshUsers,
            updateUser,
            deleteUser,
            isLoading,
            isLoadingUsers
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
