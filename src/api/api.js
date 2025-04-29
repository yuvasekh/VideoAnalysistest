import axios from 'axios';
export async function fetchObjects() {
  try {
    const response = await axios.get('http://localhost:5000/listobjects'); 
    return response.data;  // Assuming backend sends array like ['Object1', 'Object2']
  } catch (error) {
    console.error('Error fetching objects:', error);
    throw error;
  }
}

// Fetch fields for a specific object
export async function fetchFieldNames(objectName) {
  try {
    const response = await axios.get(`http://localhost:5000/listfields?objectName=${encodeURIComponent(objectName)}`);
    return response.data;  // Assuming backend sends array like ['Field1', 'Field2']
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw error;
  }
}

  export async function addInstance( instanceUrl, accessKey ) {
    try {
      const response = await axios.post('http://localhost:5000/addinstance', {
        instanceUrl,
        accesskey: accessKey
      });
  
      // You can return whatever you get from backend
      return response.data; 
    } catch (error) {
      console.error('Error adding instance:', error);
      throw error; // Rethrow to handle it in the caller
    }
  }
  export async function createField( fieldName, displayName ) {
    try {
      const response = await axios.put('http://localhost:5000/addfield', {
        fieldName, displayName 
      });
  
      // You can return whatever you get from backend
      return response.data; 
    } catch (error) {
      console.error('Error adding instance:', error);
      throw error; // Rethrow to handle it in the caller
    }
  }
  export async function createObject( fieldName, displayName ) {
    try {
      const response = await axios.post('http://localhost:5000/addobject', {
        fieldName, displayName
      });
  
      // You can return whatever you get from backend
      return response.data; 
    } catch (error) {
      console.error('Error adding instance:', error);
      throw error; // Rethrow to handle it in the caller
    }
  }