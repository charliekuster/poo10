import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";

const app = new App()
const userList: User[] = app.getUser()
const bikeList: Bike[] = app.getBike()
const rentList: Rent[] = app.getRent()
app.registerUser(new User('Joao Luiz', 'jojo@mail.com', '5566','1'))
app.registerUser(new User('Renato', 'rabbit@mail.com', 'pamonha123','2'))
app.registerBike(new Bike('Caloi 369', 'Road',  20, 100, 800, true, 'Inacreditavel, impressionante e inabalavel', 4.7, ['image1.jpg'], '1', 13.5357999, 144.8026399 ))
app.registerBike(new Bike('BMX 157', 'Road',  18, 150, 500, true,'Mais rápido que relâmpago marquinhos.', 4.5, ['image2.jpg'], '2', 33.8719347, -2.0232321))

app.updateBikeLocation('1', 15.55556, 17.66667) //update da localização da bicicleta


/*if (app.autheticateUser('rabbit@mail.com', 'pamonha123')) {
    console.log('User and password are correct.')
}
else {
    console.log('User and password are wrong.')
}
*/
//console.log(userList)
console.log(bikeList)
//console.log(rentList)

//console.log(app.findUser('maria@mail.com'))
//console.log(app.rentBike())
//console.log(app.rentBike('maria@mail.com'))
