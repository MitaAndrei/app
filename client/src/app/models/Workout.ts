import {Label} from "./Label";

export interface Workout{
  id: string;
  description: string,
  duration: number,
  musclesTargeted: string[],
  date: Date,
  labels: Label[],
  isTemplate: boolean,
}
