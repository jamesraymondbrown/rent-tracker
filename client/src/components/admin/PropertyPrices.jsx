import React, { useState, useContext, useRef } from 'react';
import { DataBaseContext } from "../../providers/DataBaseProvider";
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FilterMatchMode } from "primereact/api"
import { InputText } from "primereact/inputtext"
import './Dashboard.scss'

export default function PropertyPrices() {

  const { properties, setProperties, prices, setPrices } = useContext(DataBaseContext);

  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);

  const [filters, setFilters] = useState({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
  })
  
  const deletePricesForProperty = (property) => {
    return prices
      .filter(price => {
        return price.property_id !== property.id
      })
      .map(price => {
        return price
      })
  }

  const handleDelete = (id) => {
    console.log("Clicked Delete Property")
    axios.delete(`http://localhost:8001/properties/${id}`)
      .then((response) => {
        console.log('Property Deleted', response.data);
        const index = properties.findIndex((p) => p.id === response.data.id);
        const newProperties = [...properties]
        newProperties.splice(index, 1)
        setProperties(newProperties)
        const newPrices = deletePricesForProperty(response.data)
        setPrices(newPrices)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const priceDelete = (id) => {
    console.log("Clicked Delete Price")
    axios.delete(`http://localhost:8001/prices/${id}`)
      .then((response) => {
        console.log('Price Deleted', response.data);
        const index = prices.findIndex((p) => p.id === response.data.id);
        const newPrices = [...prices]
        newPrices.splice(index, 1)
        setPrices(newPrices)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const trimSqlDate = (date) => {
    return date.split('').splice(0, 10).join('')
  }
  
  let tableProperties
    (properties && prices) && (tableProperties = properties.map((property) => {
      const getPricesForProperty = (propertyId, prices) => {
        let propertyPriceArray = []
          for (let price of prices) {
            if (price.property_id === propertyId) {
              const newPrice = {
                ...price,
                date: trimSqlDate(price.date),
                priceDel: <Button label="Delete" className="p-button-danger" onClick={() => priceDelete(newPrice.id)} />
              }
              propertyPriceArray.push(newPrice)
            }
          }
        return propertyPriceArray
      }      

    return {
      id: property.id,
      address: property.street_address,
      city: property.city,
      province: property.province,
      propertyPrices: getPricesForProperty(property.id, prices),
      deleteProp: <Button label="Delete" className="p-button-danger" onClick={() => handleDelete(property.id)} /> 
    }  
  }))

  const onRowExpand = (event) => {
      toast.current.show({severity: 'info', summary: 'Property Expanded', detail: event.data.name, life: 1500});
  }

  const onRowCollapse = (event) => {
      toast.current.show({severity: 'success', summary: 'Property Collapsed', detail: event.data.name, life: 1500});
  }

  const expandAll = () => {
    let _expandedRows = {};
    tableProperties.forEach(tableProperty => _expandedRows[`${tableProperty.id}`] = true);
    setExpandedRows(_expandedRows);
  }

  const collapseAll = () => {
    setExpandedRows(null);
  }

  const allowExpansion = (rowData) => {
    return true
  };

  const rowExpansionTemplate = (data) => {       
    return (
      <div className="property-prices">
        <h5>Price history for {data.id}</h5>
        <DataTable value={data.propertyPrices.reverse()}
          responsiveLayout="scroll"
          paginator
          rows={5}
        >
          <Column field="id" header="Id" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="price" header="Price" sortable></Column>
          <Column field="priceDel" header="Delete" />
        </DataTable>
      </div>
    );
  }

  const header = (
    <div className="table-header-container">
      {/* <h3>Products and Prices</h3> */}
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="expand" />
      <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} className="collapse" />
      <InputText
      placeholder="Search"
      onInput={(e) =>
        setFilters({
          global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }
      })}
      />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable  value={tableProperties}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        scrollable scrollHeight="650px"
        filters={filters}
      >
        <Column expander={allowExpansion} className="expand-icon"/>
        <Column field="id" header="Id" sortable />
        <Column field="address" header="Address" sortable />
        <Column field="city" header="City" sortable />
        <Column field="province" header="Province" sortable />
        <Column field="deleteProp" header="Delete" />
      </DataTable>
    </div>
  );
}