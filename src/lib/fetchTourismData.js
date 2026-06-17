import { getTourismData } from "@/lib/tourismData";

export async function fetchTourismDataFromApi() {
  return getTourismData();
}
