export interface ISubscription {
    status: string;
    planId: string;
    secondsRemaining: number;
    concurrentCallLimit: number;
    cancelAtPeriodEnd: boolean;
}

export interface IWorkshop {
    _id: string;
    name: string;
}

export interface IUser {
    _id: string;
    email: string;
    name: string;
    picture: string;
    emailVerified: boolean;
    workShops: IWorkshop[];
    subscription: ISubscription;
    createdAt: string;
    updatedAt: string;
    refreshToken?: string;
}