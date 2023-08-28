import React, { createContext, useContext, useState } from "react";

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  const updateAttendance = (updatedData) => {
    setAttendanceData(updatedData);
  };

  return (
    <AttendanceContext.Provider value={{ attendanceData, updateAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};
