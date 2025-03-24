import { User } from '../../pages/users/users.interface';

export interface PushConfigurationRoot {
    websocket: {
        [key: string]: string
    }
    user: PushConfigurationUser
}

export interface PushConfigurationUser extends User {
    hasPushContact: boolean
}
