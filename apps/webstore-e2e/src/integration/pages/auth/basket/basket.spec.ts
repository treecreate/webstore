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

    it('should increase amount of trees donated', () => {

    });

    it('should decrease amount of trees donated', () => {

    }); 

    it('should apply discount', () => {

    }); 

    it('should go to checkout', () => {

    }); 

    describe('AddToBasketModal', () => {
        it('should save design and direct to login if user is not logged in', () => {

        });

        it('should have the title written if it is in the product page', () => {
            
        });

        it('should be able to change title', () => {
            
        });

        it('it should set the title to untitled if there is no title', () => {
            
        });

        it('should increase quantity', () => {
            
        });

        it('should decrease quantity', () => {
            
        });

        it('should increase dimensions', () => {
            
        });

        it('should decrease dimensions', () => {
            
        });
    }); 
})