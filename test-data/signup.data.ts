export const validationTests = [
    {
        testName: 'Full Name is empty',
        fullName: '   ',
        companyName: 'Acme Corp',
        email: 'test@example.com', // Убрали Date.now(), тут он не нужен
        password: 'password123',
        expectedError: 'Full name is required'
    },
    {
        testName: 'Company Name is empty',
        fullName: 'John Doe',
        companyName: '   ',
        email: 'test@example.com',
        password: 'password123',
        expectedError: 'Company name is required'
    },
    {
        testName: 'Email is empty',
        fullName: 'John Doe',
        companyName: 'Acme Corp',
        email: '   ',
        password: 'password123',
        expectedError: 'Email is required'
    },
    {
        testName: 'Email is invalid',
        fullName: 'John Doe',
        companyName: 'Acme Corp',
        email: 'invalid-email',
        password: 'password123',
        expectedError: 'Invalid email format'
    },
    {
        testName: 'Password is empty',
        fullName: 'John Doe',
        companyName: 'Acme Corp',
        email: 'test@example.com',
        password: '           ',
        expectedError: 'Password is required'
    },
    {
        testName: 'Password is too short',
        fullName: 'John Doe',
        companyName: 'Acme Corp',
        email: 'test@example.com',
        password: 'pass',
        expectedError: 'Password should be at least 6 characters'
    }
];