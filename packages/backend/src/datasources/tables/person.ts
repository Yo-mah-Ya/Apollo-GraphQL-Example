import { intersection, type, partial, string, number, TypeOf, array } from "io-ts";
import { planet, species, starship, vehicle } from "./common";

export const person = intersection([
    type({
        id: string,
        created: string,
        edited: string,
        gender: string,
        name: string,
    }),
    partial({
        films: array(string),
        species: species,
        starships: array(starship),
        vehicles: array(vehicle),
        homeworld: planet,
        birthYear: string,
        height: number,
        mass: number,
        hairColor: array(string),
        eyeColor: array(string),
        skinColor: array(string),
    }),
]);
export type Person = TypeOf<typeof person>;
export const isPerson = (u: unknown): u is Person => person.is(u);
