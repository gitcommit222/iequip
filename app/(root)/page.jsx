"use client";
import React from "react";
import HeaderBox from "../../components/shared/Headerbox";
import InfoBox from "../../components/InfoBox";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import { useGetItems } from "../../hooks/useItem";
import { useFetchBorrowedItems } from "../../hooks/useBorrowItem";
import NotifDrawer from "../../components/NotifDrawer";
import { borrowedItem, item, lostItem, returnedItem } from "../../public";
import { useGetTransactionsByCategory } from "../../hooks/useTransactions";
import { useUser } from "../../hooks/useAuth";

const Home = () => {
  const { data: items, isLoading } = useGetItems();
  const { data: currentUser } = useUser();
  const { data: transactions, isLoading: isTransactionsLoading } =
    useGetTransactionsByCategory("items");

  const totalItems = items && items?.data?.length;

  const totalBorrowedItems =
    transactions &&
    transactions?.data.filter((t) => t.t_status === "borrowed")?.length;

  const totalReturnedItems =
    transactions &&
    transactions?.data.filter((t) => t.t_status === "returned")?.length;

  // Calculate most borrowed items (3 or more times)
  const getMostBorrowedItems = () => {
    if (!transactions?.data) return [];

    // Count occurrences of each item
    const itemCounts = transactions?.data.reduce((acc, transaction) => {
      const itemId = transaction.item_id;
      acc[itemId] = (acc[itemId] || 0) + 1;
      return acc;
    }, {});

    // Filter items borrowed 3 or more times
    const frequentlyBorrowedItems = Object.entries(itemCounts)
      .filter(([_, count]) => count >= 3)
      .map(([itemId, count]) => ({
        itemId,
        count,
        itemName: items?.data.find(item => item.id === itemId)?.itemName || 'Unknown Item'
      }))
      .sort((a, b) => b.count - a.count);

    return frequentlyBorrowedItems;
  };

  const mostBorrowedItems = getMostBorrowedItems();

  return (
    <section>
      <div className="flex items-center justify-between">
        <HeaderBox
          title={`Hello, ${currentUser?.fetchedUser?.name || "User"}`}
          type="greeting"
          subtext="Track your data progress here."
        />
        <div>
          <NotifDrawer />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <InfoBox
            title="Total Items"
            data={isLoading ? "..." : totalItems || 0}
            iconUrl={item}
          />
          <InfoBox
            title="Borrowed Items"
            data={isTransactionsLoading ? "..." : totalBorrowedItems || 0}
            iconUrl={borrowedItem}
          />
          <InfoBox
            title="Returned Items"
            data={isTransactionsLoading ? "..." : totalReturnedItems || 0}
            iconUrl={returnedItem}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex-1">
            <h1 className="font-semibold text-[17px] mb-1">
              Most Borrowed Items (3+ times)
            </h1>
            <div className="rounded-lg bg-white h-[500px] p-3 flex items-center justify-center">
              <BarChart data={mostBorrowedItems} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;