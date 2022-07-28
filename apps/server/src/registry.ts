import { RoomBuilderRepository, RoomRepository } from "./domain/t3";

export type Registry = {
  t3RoomRepository: RoomRepository;
  t3RoomBuilderRepository: RoomBuilderRepository;
};
export const createRegistry = (): Registry => {
  const t3RoomRepository = new RoomRepository();
  const t3RoomBuilderRepository = new RoomBuilderRepository();

  return {
    t3RoomRepository,
    t3RoomBuilderRepository,
  };
};
