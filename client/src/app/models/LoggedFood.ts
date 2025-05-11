import {Food} from "./Food";

export interface LoggedFood{
  id: string;
  food: Food;
  date: Date;
  grams: number;
}
