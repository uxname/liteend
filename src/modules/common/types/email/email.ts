import validator from 'validator';

export class Email {
    private _value!: string;

    constructor(value: string) {
        this.value = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        if (!Email.validate(value)) {
            throw new Error(`Invalid email: ${value}`);
        }
        this._value = value.trim().toLowerCase();
    }

    private static validate(value: string): boolean {
        return validator.isEmail(value);
    }

}

