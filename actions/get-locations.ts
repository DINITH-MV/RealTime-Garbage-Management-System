import { db } from "../lib/db";
import { Location } from "@prisma/client";

type location = Location;

type GetLocations = {
  id: string;
};

export const getAllFeedbacks = async ({ id }: GetLocations): Promise<location[]> => {
  try {
    const feedbacks = await db.location.findMany({
      where: {
        id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return feedbacks;
  } catch (error) {
    console.log("[GET_FEEDBACKS]", error);
    return [];
  }
};