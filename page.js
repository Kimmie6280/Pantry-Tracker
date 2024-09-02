'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '../firebase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = useCallback(async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        console.log(doc.id, " => ", doc.data()); // Log each document
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const removeItem = useCallback(async (name) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: docQuantity } = docSnap.data();
        if (docQuantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: docQuantity - 1 });
        }
      }

      await updateInventory();
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  }, [updateInventory]);

  const searchInput = () =>{
    const [searchItem, setSearchQuery] = useState('')

  }
  const onSearch = (event: React.FormEvent) => {
    event,preventDefault();
  }



  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#ffe6e6"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal> 
      
      <Button 
        variant="contained"
        onClick={handleOpen}
      >Add new item</Button>

      <form className='flex justify-center w-2/3' onSubmit={onSearch}>
        <input value={searchInput}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder='search'/>
      </form>
     
      
      <Box border="1px solid #333">
        <Box 
          width="880px" 
          height="100px" 
          bgcolor="#add8e6" 
          alignItems="center" 
          display="flex" 
          justifyContent="center"
        >
          <Typography 
            variant='h2' 
            color="#333"
          >
            Inventory Items
          </Typography>
        </Box>
      
        <Stack
          width="900px"
          height="300px"
          spacing={2}
          overflow="auto"
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant='h3' color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant='h3' color="#333" textAlign="center">
                {quantity}
              </Typography>

              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>

              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
