export function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Critical error: Missing environment variable ${key}. Please add it to the .env file.`);
    }

    return value;
}