import React, { useState, createContext, useContext } from "react";
import { jobDBType } from "@/src/typesAndSchemas/jobs";

type BookmarkContextType = {
  jobs: jobDBType[];
  setJobs: React.Dispatch<React.SetStateAction<jobDBType[]>>;
  jobIds: Set<string>;
  setJobIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<jobDBType[]>([]);
  const [jobIds, setJobIds] = useState<Set<string>>(new Set());

  return (
    <BookmarkContext.Provider value={{ jobs, setJobs, jobIds, setJobIds }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider"
    );
  }
  return context;
}
