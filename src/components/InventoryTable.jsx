import React, { useState } from "react";
import "./InventoryTable.css";

const InventoryTable = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item A", category: "Electronics", quantity: 15 },
    { id: 2, name: "Item B", category: "Furniture", quantity: 5 },
  ]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
  });
  const [filter, setFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const categories = [...new Set(items.map((item) => item.category))];

  const addItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      quantity: Number(newItem.quantity),
      category: newItem.category || "Uncategorized",
    };
    setItems((prevItems) => [...prevItems, itemToAdd]);
    setNewItem({ name: "", category: "", quantity: "" });
  };

  const updateItem = (id, updatedFields) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
    setEditingItem(null);
  };

  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleEditStart = (item) => {
    setEditingItem({ ...item });
  };

  const handleEditChange = (field, value) => {
    setEditingItem((prev) => ({
      ...prev,
      [field]: field === "quantity" ? Number(value) : value,
    }));
  };

  const isLowStock = (quantity) => quantity < 10;

  const sortedItems = [...items].sort((a, b) =>
    sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity
  );

  const filteredItems = filter
    ? sortedItems.filter((item) => item.category.includes(filter))
    : sortedItems;

  return (
    <div className="container">
      <h2>Inventory Management System</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Category (optional)"
          list="category-options"
          value={newItem.category}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, category: e.target.value }))
          }
        />
        <datalist id="category-options">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
          }
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Filter by Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort by Quantity ({sortAsc ? "Ascending" : "Descending"})
        </button>
      </div>
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>No items available in inventory</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={isLowStock(item.quantity) ? "low-stock" : ""}
              >
                <td>
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      onBlur={() =>
                        updateItem(item.id, { name: editingItem.name })
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) =>
                        handleEditChange("category", e.target.value)
                      }
                      onBlur={() =>
                        updateItem(item.id, { category: editingItem.category })
                      }
                    />
                  ) : (
                    item.category
                  )}
                </td>
                <td>
                  {editingItem?.id === item.id ? (
                    <input
                      type="number"
                      value={editingItem.quantity}
                      onChange={(e) =>
                        handleEditChange("quantity", e.target.value)
                      }
                      onBlur={() =>
                        updateItem(item.id, { quantity: editingItem.quantity })
                      }
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td>
                  <div className="button-group">
                    {editingItem?.id === item.id ? (
                      <button
                        className="btn-ec"
                        onClick={() => setEditingItem(null)}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        className="btn-ec"
                        onClick={() => handleEditStart(item)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="btn-de"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryTable;
