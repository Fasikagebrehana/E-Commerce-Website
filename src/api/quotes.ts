import client from "./client";
import type { Quote } from "../types/quote";

export const getRandomQuotes = async (count: number): Promise<Quote[]> => {
    // 1454 quotes in total; start somewhere random so the page varies between visits
    const skip = Math.floor(Math.random() * 1400);
    const response = await client.get("/quotes", { params: { limit: count, skip } });
    return response.data.quotes;
}
