import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Camera, Edit, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useData, Transaction, Category } from "@/contexts/DataContext";
import { BillCamera } from "@/components/BillCamera";
import { motion } from "framer-motion";

const categoryIcons: Record<Category, React.ReactNode> = {
  housing: "🏠",
  food: "🍔",
  transportation: "🚗",
  utilities: "💡",
  healthcare: "⚕️",
  entertainment: "🎬",
  shopping: "🛍️",
  personal: "👤",
  education: "🎓",
  debt: "💳",
  savings: "💰",
  income: "💵",
  other: "📦",
};

const Transactions = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useData();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState<
    Partial<Omit<Transaction, "id">>
  >({
    amount: 0,
    description: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Handle form submission for adding transaction
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newTransaction.description &&
      newTransaction.amount &&
      newTransaction.category &&
      newTransaction.date
    ) {
      addTransaction({
        amount: Number(newTransaction.amount),
        description: newTransaction.description,
        category: newTransaction.category as Category,
        date: newTransaction.date,
        type: newTransaction.type || "expense",
        billImageUrl: capturedImageUrl || undefined,
      });

      // Reset form
      setNewTransaction({
        amount: 0,
        description: "",
        category: "other",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
      setCapturedImageUrl(null);
      setIsAddingTransaction(false);
      setShowCamera(false);
    }
  };

  // Handle form submission for editing transaction
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTransaction && currentTransaction.id) {
      updateTransaction(currentTransaction.id, {
        amount: Number(currentTransaction.amount),
        description: currentTransaction.description,
        category: currentTransaction.category,
        date: currentTransaction.date,
        type: currentTransaction.type,
        billImageUrl: capturedImageUrl || currentTransaction.billImageUrl,
      });

      setCurrentTransaction(null);
      setCapturedImageUrl(null);
      setIsEditingTransaction(false);
      setShowCamera(false);
    }
  };

  // Handle deleting transaction
  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  // Handle editing transaction
  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsEditingTransaction(true);
  };

  // Handle image capture from camera
  const handleImageCapture = (imageUrl: string) => {
    setCapturedImageUrl(imageUrl);
  };

  const handleAmountDetected = (amount: number) => {
    if (isEditingTransaction && currentTransaction) {
      setCurrentTransaction({
        ...currentTransaction,
        amount: amount,
      });
    } else {
      setNewTransaction({
        ...newTransaction,
        amount: amount,
        type: "expense", // Assume bills are expenses
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your transactions
            </p>
          </div>

          <Dialog
            open={isAddingTransaction}
            onOpenChange={setIsAddingTransaction}
          >
            <DialogTrigger asChild>
              <Button className="bg-pocket-purple hover:bg-pocket-vivid">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  {showCamera
                    ? "Take a photo of your bill or receipt"
                    : "Enter the details of your transaction or scan a bill"}
                </DialogDescription>
              </DialogHeader>

              {showCamera ? (
                <div className="py-4">
                  <BillCamera
                    onCapture={handleImageCapture}
                    onAmountDetected={handleAmountDetected}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowCamera(false)}
                    >
                      Back to Form
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Transaction Type</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value) =>
                          setNewTransaction({
                            ...newTransaction,
                            type: value as "expense" | "income",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newTransaction.amount || ""}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTransaction.description || ""}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) =>
                          setNewTransaction({
                            ...newTransaction,
                            category: value as Category,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryIcons).map(
                            ([category, icon]) => (
                              <SelectItem key={category} value={category}>
                                <span className="inline-flex items-center">
                                  <span className="mr-2">{icon}</span>{" "}
                                  {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date || ""}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCamera(true)}
                        className="w-full"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Bill or Receipt
                      </Button>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-pocket-purple hover:bg-pocket-vivid"
                    >
                      Add Transaction
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={isEditingTransaction}
            onOpenChange={setIsEditingTransaction}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Transaction</DialogTitle>
                <DialogDescription>
                  {showCamera
                    ? "Take a photo of your bill or receipt"
                    : "Update the details of your transaction"}
                </DialogDescription>
              </DialogHeader>

              {currentTransaction && (
                <>
                  {showCamera ? (
                    <div className="py-4">
                      <BillCamera
                        onCapture={handleImageCapture}
                        onAmountDetected={handleAmountDetected}
                      />
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setShowCamera(false)}
                        >
                          Back to Form
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleEditSubmit}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-type">Transaction Type</Label>
                          <Select
                            value={currentTransaction.type}
                            onValueChange={(value) =>
                              setCurrentTransaction({
                                ...currentTransaction,
                                type: value as "expense" | "income",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expense">Expense</SelectItem>
                              <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-amount">Amount</Label>
                          <Input
                            id="edit-amount"
                            type="number"
                            step="0.01"
                            value={currentTransaction.amount || ""}
                            onChange={(e) =>
                              setCurrentTransaction({
                                ...currentTransaction,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input
                            id="edit-description"
                            value={currentTransaction.description || ""}
                            onChange={(e) =>
                              setCurrentTransaction({
                                ...currentTransaction,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Select
                            value={currentTransaction.category}
                            onValueChange={(value) =>
                              setCurrentTransaction({
                                ...currentTransaction,
                                category: value as Category,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(categoryIcons).map(
                                ([category, icon]) => (
                                  <SelectItem key={category} value={category}>
                                    <span className="inline-flex items-center">
                                      <span className="mr-2">{icon}</span>{" "}
                                      {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                    </span>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input
                            id="edit-date"
                            type="date"
                            value={currentTransaction.date || ""}
                            onChange={(e) =>
                              setCurrentTransaction({
                                ...currentTransaction,
                                date: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        {currentTransaction.billImageUrl && (
                          <div className="pt-2">
                            <p className="text-sm text-muted-foreground mb-2">
                              Current Receipt Image:
                            </p>
                            <div className="relative w-full h-40 mb-2">
                              <img
                                src={currentTransaction.billImageUrl}
                                alt="Receipt"
                                className="rounded-md object-cover w-full h-full"
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCamera(true)}
                            className="w-full"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            {currentTransaction.billImageUrl
                              ? "Update Receipt Image"
                              : "Add Receipt Image"}
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          className="bg-pocket-purple hover:bg-pocket-vivid"
                        >
                          Update Transaction
                        </Button>
                      </DialogFooter>
                    </form>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryIcons).map(([category, icon]) => (
                    <SelectItem key={category} value={category}>
                      <span className="inline-flex items-center">
                        <span className="mr-2">{icon}</span>{" "}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTransactions.length > 0 ? (
              <div className="overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map((transaction) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">
                              {categoryIcons[transaction.category] || "📦"}
                            </span>
                            {transaction.category.charAt(0).toUpperCase() +
                              transaction.category.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`py-1 px-2 rounded-full text-xs font-medium ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Transaction
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      transaction? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDelete(transaction.id)
                                      }
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              {transaction.billImageUrl && (
                                <DropdownMenuItem asChild>
                                  <a
                                    href={transaction.billImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Camera className="mr-2 h-4 w-4" />
                                    View Receipt
                                  </a>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="inline-block rounded-full bg-gray-100 p-3 mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-muted-foreground mt-1">
                  Try changing your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
