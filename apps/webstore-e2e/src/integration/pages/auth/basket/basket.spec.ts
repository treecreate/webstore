import { IUser } from '@interfaces';
import { CookieStatus, LocalStorageVars, UserRoles } from '@models';
import { AuthenticationService, AuthUserEnum } from '@webstore/mocks';

const authMockService = new AuthenticationService();

describe('BasketPage', () => {
    beforeEach(() => {
        localStorage.setItem(
            LocalStorageVars.cookiesAccepted,
            `"${CookieStatus.rejected}"`
        );
        localStorage.setItem(
            LocalStorageVars.authUser,
            JSON.stringify(authMockService.getMockUser(AuthUserEnum.authUser))
        );
    }); 

    
})