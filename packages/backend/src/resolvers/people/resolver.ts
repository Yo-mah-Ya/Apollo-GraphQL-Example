import { query } from "../../common/pagination";
import type { Person } from "../../datasources/tables";
import { isNotNullish } from "../../common";
import type { Resolvers } from "../types";
import { data as peopleData } from "../people/test-data";
import { data as planetsData } from "../planets/test-data";
import { data as speciesData } from "../species/test-data";
import { data as starshipsData } from "../starships/test-data";
import { data as vehiclesData } from "../vehicles/test-data";

type ArrayElementType<T> = T extends (infer E)[] ? E : T;
const toVehicle = (id: string): ArrayElementType<Person["vehicles"]> => {
    const vehicles = vehiclesData.find((v) => v.id === id);
    return vehicles
        ? {
              ...vehicles,
              costInCredits: vehicles.cost_in_credits,
              maxAtmospheringSpeed: vehicles.max_atmosphering_speed,
              cargoCapacity: vehicles.cargo_capacity,
              vehicleClass: vehicles.vehicle_class,
          }
        : undefined;
};
const toStarship = (id: string): ArrayElementType<Person["starships"]> => {
    const starship = starshipsData.find((s) => s.id === id);
    return starship
        ? {
              ...starship,
              costInCredits: starship.cost_in_credits,
              maxAtmospheringSpeed: starship.max_atmosphering_speed,
              cargoCapacity: starship.cargo_capacity,
              hyperdriveRating: starship.hyperdrive_rating,
              starshipClass: starship.starship_class,
          }
        : undefined;
};
const toPlanet = (id: string): ArrayElementType<Person["homeworld"]> => {
    return planetsData.find((s) => s.id === id);
};

const toSpecies = (id: string): ArrayElementType<Person["species"]> => {
    const species = speciesData.find((s) => s.id === id);
    return species
        ? {
              ...species,
              averageLifespan: species.average_lifespan,
              averageHeight: species.average_height,
              skinColors: species.skin_colors,
              hairColors: species.hair_colors,
              eyeColors: species.eye_colors,
              homeworld: species.homeworld ? toPlanet(species.homeworld) : undefined,
          }
        : undefined;
};

const toPerson = (person: (typeof peopleData)[number]): Person => ({
    ...person,
    hairColor: person.hair_color,
    skinColor: person.skin_color,
    eyeColor: person.eye_color,
    homeworld: planetsData.find((p) => p.id === person?.homeworld),
    species: person.species ? toSpecies(person.species) : undefined,
    starships: person.starships.map(toStarship).filter(isNotNullish),
    vehicles: person.vehicles.map(toVehicle).filter(isNotNullish),
});

export const resolvers: Resolvers = {
    Query: {
        allPeople: async (_, args) => {
            return await query(args, "people", {
                firstTimeQuery: async ({ first }) => {
                    const resultPeople = peopleData.slice(0, first).map(toPerson);
                    return {
                        totalCount: peopleData.length,
                        nodes: resultPeople,
                    };
                },
                forwardQuery: async (args) => {
                    args;
                    return {
                        totalCount: 0,
                        nodes: [],
                    };
                },
                backwardQuery: async (args) => {
                    args;
                    return {
                        totalCount: 0,
                        nodes: [],
                    };
                },
            });
        },
    },
    // Person: {
    //     filmConnection: async (parent, args, { dataSources }: ServiceContext) => {
    //         return {
    //             pageInfo: {
    //                 hasPreviousPage: false,
    //                 hasNextPage: first <= [].length,
    //                 ...responseCursor([]),
    //             },
    //             totalCount: 0,
    //             nodes: [],
    //             edges: [],
    //         };
    //     },
    // },
};
