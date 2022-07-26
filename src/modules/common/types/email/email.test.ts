import {Email} from './email';

describe('Email tests', () => {
    test('Should test email (constructor): test@test.com', async () => {
        const emailValue = 'test@test.com';
        const email = new Email(emailValue);
        expect(email.value).toEqual(emailValue);
    });

    test('Should test email (setter): test@test.com', async () => {
        const emailValue = 'test@test.com';
        const email = new Email('init@init.com');
        email.value = emailValue;
        expect(email.value).toEqual(emailValue);
    });

    test('Should test email: test-test.com', async () => {
        const emailValue = 'non-valid-email-test.com';
        // should throw error
        expect(() => {
            const email = new Email(emailValue);
            console.debug(email);
        }).toThrowError(`Invalid email: ${emailValue}`);
    });
});
