"use client";
import { Table, Tooltip, TextInput, Button, Badge } from "flowbite-react";
import {
  FaSearch,
  FaFileExport,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { format, formatDistance, startOfMonth, endOfMonth } from "date-fns";
import { useLogs, useUser } from "../hooks/useAuth";

const LogsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonth, setSelectedMonth] = useState("");

  const { data: user } = useUser();
  const userId = user?.fetchedUser?.id;
  const { data: userLogs } = useLogs(userId);

  const filteredAndSortedLogs = useMemo(() => {
    if (!userLogs) return [];

    return userLogs
      .filter((log) => {
        const matchesSearch =
          log.User.name.includes(searchTerm.toLowerCase()) ||
          log.id.toString().includes(searchTerm.toLowerCase()) ||
          (log.action || "").toLowerCase().includes(searchTerm.toLowerCase());

        if (!selectedMonth) return matchesSearch;

        const logDate = new Date(log.loginTime);
        const [year, month] = selectedMonth.split("-");
        const startDate = startOfMonth(new Date(year, month - 1));
        const endDate = endOfMonth(new Date(year, month - 1));

        return matchesSearch && logDate >= startDate && logDate <= endDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.loginTime);
        const dateB = new Date(b.loginTime);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [userLogs, searchTerm, sortOrder, selectedMonth]);

  const exportToExcel = () => {
    const dataToExport = filteredAndSortedLogs.map((log) => ({
      User: log.user,
      Action: log.action.toUpperCase(),
      Date: format(new Date(log.loginTime), "MM/dd/yy HH:mm:ss"),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Logs");
    XLSX.writeFile(wb, "user_logs.xlsx");
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const getActionColor = (action) => {
    return action.toLowerCase() === "in" ? "success" : "pink";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <TextInput
          icon={FaSearch}
          placeholder="Search by user or action"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <Button onClick={toggleSortOrder} color="light">
          {sortOrder === "asc" ? (
            <FaSortAmountUp className="mr-2" />
          ) : (
            <FaSortAmountDown className="mr-2" />
          )}
          Sort by Date
        </Button>
        <Button onClick={exportToExcel} color="success">
          <FaFileExport className="mr-2" />
          Export to Excel
        </Button>
      </div>
      <div className="overflow-x-auto shadow-sm">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <Table.Head className="sticky top-0 bg-white dark:bg-gray-800">
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Login Time</Table.HeadCell>
              <Table.HeadCell>Logout Time</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredAndSortedLogs.map((log) => (
                <Table.Row
                  key={log.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {log.id}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {log.User.name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Tooltip
                      content={format(
                        new Date(log.loginTime),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    >
                      {(() => {
                        const date = new Date(log.loginTime);
                        const now = new Date();
                        const diffInDays = Math.floor(
                          (now - date) / (1000 * 60 * 60 * 24)
                        );

                        if (diffInDays < 1) {
                          return formatDistance(date, now, { addSuffix: true });
                        }
                        return format(date, "MMM d, yyyy 'at' h:mm a");
                      })()}
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {log.logoutTime ? (
                      <Tooltip
                        content={format(
                          new Date(log.logoutTime),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      >
                        {format(
                          new Date(log.logoutTime),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LogsTable;
