import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Location } from "./location";
import crypto from 'crypto';

export class RentNotFoundError extends Error {
    constructor() {
        super('Rent not found.');
        this.name = 'RentNotFoundError';
    }
}

export class BikeNotFoundError extends Error {
    constructor() {
        super('Bike not found.');
        this.name = 'BikeNotFoundError';
    }
}

export class UnavailableBikeError extends Error {
    constructor() {
        super('Unavailable bike.');
        this.name = 'UnavailableBikeError';
    }
}

export interface RentRepo {
    findOpenRentsFor(userEmail: string): Rent[];
}

export class FakeRentRepo implements RentRepo {
    private rents: Rent[] = [];

    findOpenRentsFor(userEmail: string): Rent[] {
        return this.rents.filter(rent => rent.user.email === userEmail && !rent.end);
    }
}

export class App {
    constructor(private rentRepo: RentRepo) {}
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []
    crypt: Crypt = new Crypt()

    findUser(email: string): User | undefined {
        const user =  this.users.find(user => user.email === email)
        if (!user) throw new Error('User not found.')
        return user
    }


    async registerUser(user: User): Promise<string> {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        this.users.push(user)
        return newId
    }

    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = this.findUser(userEmail)
        if (!user) throw new Error('User not found.')
        return await this.crypt.compare(password, user.password)
    }

    registerBike(bike: Bike): string {
        const newId = crypto.randomUUID()
        bike.id = newId
        this.bikes.push(bike)
        return newId
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            const openRents = this.rentRepo.findOpenRentsFor(email);
            if (openRents.length > 0) {
                throw new Error('User has open rents, cannot be removed.');
            }
            this.users.splice(userIndex, 1);
            return;
        }
        throw new Error('User does not exist.');
    }
    
    rentBike(bikeId: string, userEmail: string): void {
        const bike = this.findBike(bikeId)
        if (!bike.available) {
            throw new Error('Unavailable bike.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        bike.available = false
        const newRent = new Rent(bike, user, new Date())
        this.rents.push(newRent)
    }

    returnBike(bikeId: string, userEmail: string): number {
        const now = new Date()
        const rent = this.rents.find(rent =>
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            !rent.end
        )
        if (!rent) {
            throw new RentNotFoundError();
        }
        rent.end = now
        rent.bike.available = true
        const hours = diffHours(rent.end, rent.start)
        return hours * rent.bike.rate
    }
    
    

    listUsers(): User[] {
        return this.users
    }

    listBikes(): Bike[] {
        return this.bikes
    }

    listRents(): Rent[] {
        return this.rents
    }

    moveBikeTo(bikeId: string, location: Location) {
        const bike = this.findBike(bikeId)
        bike.location.latitude = location.latitude
        bike.location.longitude = location.longitude
    }

    findBike(bikeId: string): Bike {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) throw new BikeNotFoundError()
        return bike
    }
    getBikeById(bikeId: string): Bike {
        const bike = this.findBike(bikeId);
        return bike;
    }

    getUserByEmail(email: string): User | undefined {
        const user = this.users.find(user => user.email === email);
        return user;
    }
        
    
}

    function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
}
