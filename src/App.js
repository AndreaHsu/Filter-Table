import React from 'react';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { BsFillHouseFill ,BsSearch } from 'react-icons/bs';
import "./App.css";
import data from "./data.json";
import Fuse from "fuse.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        data.forEach((item) => {
            item.Price = item.Price.replace('$','').replace(',','').replace('k','')
            item.HOA = item.HOA.replace('$','').replace(',','').replace('k','')
        })

        this.state = {
            value: '',
            foundDatas: data,
            priceDir: '↕︎',
            hoaDir: '↕︎',
            domDir:'↕︎',
            type:'',
            address:'',
            lowerPrice:'',
            upperPrice:''
        }
        this.handleValue = this.handleValue.bind(this);
        this.handleFoundData = this.handleFoundData.bind(this);
        this.handleFilterData = this.handleFilterData.bind(this);
        this.handleFilterInput = this.handleFilterInput.bind(this);
        this.handleFilterInputClean = this.handleFilterInputClean.bind(this);
        this.handlePriceDir = this.handlePriceDir.bind(this);
        this.handleHOADir = this.handleHOADir.bind(this);
        this.handleDOMDir = this.handleDOMDir.bind(this);
        this.PriceSort = this.PriceSort.bind(this);
        this.HOASort = this.HOASort.bind(this);
        this.DOMSort = this.DOMSort.bind(this);
        this.handleSortDatas = this.handleSortDatas.bind(this);
    }

    handleValue(field,val) {
        this.setState({
            [field]: val
        })
    }
    handlePriceDir(e) {
        this.setState({
            priceDir: e
        })
    }
    handleHOADir(e) {
        this.setState({
            hoaDir: e
        })
    }
    handleDOMDir(e) {
        this.setState({
            domDir: e
        })
    }
    handleFoundData(event) {
        const keyword = event.target.value;
        // console.log(keyword)
        if (keyword !== '') {
            this.handlePriceDir('↕︎')
            this.handleHOADir('↕︎')
            this.handleDOMDir('↕︎')
            const fuse = new Fuse(data, {
                keys: ['Address', 'Type','Price', 'HOA', 'OpenTime','DOM','Remarks']
            })
             
            // Search
            var result = fuse.search(keyword)
            result = result.map((item)=>{
                return item.item
            })

            const results = data.filter((item) => {
            var addrCheck = item.Address.toLowerCase().includes(keyword.toLowerCase());
            var typeCheck = item.Type.toLowerCase().includes(keyword.toLowerCase());
            var priceCheck = item.Price.toLowerCase().includes(keyword.toLowerCase());
            var hoaCheck = item.HOA.toLowerCase().includes(keyword.toLowerCase());
            var domCheck = item.DOM.toLowerCase().includes(keyword.toLowerCase());
            var opentimeCheck = item.OpenTime.toLowerCase().includes(keyword.toLowerCase());

            var remarksCheck = false;
            item.Remarks.forEach(function(comment){
                remarksCheck = remarksCheck || comment.toLowerCase().includes(keyword.toLowerCase())
            });

            return addrCheck || typeCheck || priceCheck || hoaCheck || domCheck|| opentimeCheck || remarksCheck;
            // Use the toLowerCase() method to make it case-insensitive
            });
            // console.log(results)
            this.setState({
                // foundDatas: result
                foundDatas: results
            })
        } else {
            this.setState({
                foundDatas: data
            })
            // If the text field is empty, show all users
        }

        this.handleValue('value',keyword);
    }
    handleFilterInput(event) {
        const field = event.target.placeholder
        const keyword = event.target.value;
        
        this.handleValue(field,keyword);
    }
    handleFilterData() {
        // const keyword = event.target.value;
        
        this.handlePriceDir('↕︎')
        this.handleHOADir('↕︎')
        this.handleDOMDir('↕︎')
        var results = data
        // console.log(results)
        if(this.state.type !== ''){
            results = results.filter((item) => {
                return item.Type.toLowerCase().includes(this.state.type.toLowerCase());
            })
        }
        if(this.state.address !== ''){
            const fuse = new Fuse(results, {
                keys: ['Address']
            })
             
            // Search
            results = fuse.search(this.state.address)
            results = results.map((item)=>{
                return item.item
            })
            // results = results.filter((item) => {
            //     return item.Address.toLowerCase().includes(this.state.address.toLowerCase());
            // })
        }
        if(this.state.lowerPrice !== ''){
            results = results.filter((item) => {
                return item.Price > Number(this.state.lowerPrice.toLowerCase());
            })
        }
        if(this.state.upperPrice !== ''){
            results = results.filter((item) => {
                return item.Price < Number(this.state.upperPrice.toLowerCase());
            })
        }

        this.setState({
            foundDatas: results
        })
    }
    handleFilterInputClean() {
        this.handleValue('foundDatas', data)
        this.handleValue('type', '')
        this.handleValue('address', '')
        this.handleValue('lowerPrice', '')
        this.handleValue('upperPrice', '')
    }
    handleSortDatas(sortResults) {
        this.setState({
            foundDatas: sortResults
        })
    }

    PriceSort() {
        const SortResults = this.state.foundDatas.slice(0)
        this.handleHOADir('↕︎')
        this.handleDOMDir('↕︎')

        if(this.state.priceDir == '↑') 
            this.handlePriceDir('↓')
        else if (this.state.priceDir == '↓' || this.state.priceDir == '↕︎')
            this.handlePriceDir('↑')
            
        // console.log(SortResults)
        // console.log(SortResults.map((item) => {return item.Price}))
        SortResults.sort((a, b) => {
            // console.log(this.state.priceDir)
            if(this.state.priceDir == '↑'){
                return a.Price - b.Price;
            }else if (this.state.priceDir == '↓' || this.state.priceDir == '↕︎'){
                return b.Price - a.Price;
            }
        })
        // console.log(SortResults)
        this.handleSortDatas(SortResults)
      
    }
    HOASort() {
        const SortResults = this.state.foundDatas.slice(0)
        this.handlePriceDir('↕︎')
        this.handleDOMDir('↕︎')
        if(this.state.hoaDir == '↑') 
            this.handleHOADir('↓')
        else if (this.state.hoaDir == '↓' || this.state.hoaDir == '↕︎')
            this.handleHOADir('↑')
            
        // console.log(SortResults)
        // console.log(SortResults.map((item) => {return item.Price}))
        SortResults.sort((a, b) => {
            // console.log(this.state.hoaDir)
            if(this.state.hoaDir == '↑'){
                return a.HOA - b.HOA;
            }else if (this.state.hoaDir == '↓' || this.state.hoaDir == '↕︎'){
                return b.HOA - a.HOA;
            }
        })
        // console.log(SortResults)
        this.handleSortDatas(SortResults)
      
    }
    DOMSort() {
        const SortResults = this.state.foundDatas.slice(0)
        this.handlePriceDir('↕︎')
        this.handleHOADir('↕︎')
        if(this.state.domDir == '↑') 
            this.handleDOMDir('↓')
        else if (this.state.domDir == '↓' || this.state.domDir == '↕︎')
            this.handleDOMDir('↑')
            
        // console.log(SortResults)
        // console.log(SortResults.map((item) => {return item.Price}))
        SortResults.sort((a, b) => {
            console.log(this.state.domDir)
            if(this.state.domDir == '↑'){
                return a.DOM - b.DOM;
            }else if (this.state.domDir == '↓' || this.state.domDir == '↕︎'){
                return b.DOM - a.DOM;
            }
        })
        // console.log(SortResults)
        this.handleSortDatas(SortResults)
      
    }

    render() {
        return (
            <div className="App">
                <h1>House Data</h1>
                <BsSearch/><input
                    type="search"
                    value={this.state.value}
                    onChange={this.handleFoundData}
                    className="input"
                    placeholder="Filter"
                    />
                    <p/>
                <BsSearch/>  Type:<input
                    type="search"
                    value={this.state.type}
                    onChange={this.handleFilterInput}
                    className="in"
                    placeholder="type"
                    />
                    Address:<input
                    type="search"
                    value={this.state.address}
                    onChange={this.handleFilterInput}
                    className="in"
                    placeholder="address"
                    />
                    Price: lowerBound<input
                    type="search"
                    value={this.state.lowerPrice}
                    onChange={this.handleFilterInput}
                    className="in"
                    placeholder="lowerPrice"
                    />~
                    upperBound<input
                    type="search"
                    value={this.state.upperPrice}
                    onChange={this.handleFilterInput}
                    className="in"
                    placeholder="upperPrice"
                    />
                    <p className='but-group'>
                    <Button variant="outline-primary" onClick={this.handleFilterData}>search</Button>
                    {"   "}<Button variant="outline-secondary" onClick={this.handleFilterInputClean}>Clean Input</Button>
                    </p>
                <Table className="table" striped bordered hover size="sm">
                    <thead>
                    <tr className="th">
                        <th className="th-url">Url</th>
                        <th className="th-type">Type</th>
                        <th className="th-addr">Address</th>
                        <th className="th-opentime">OpenTime</th>
                        <th className="th-remark">Remarks</th>
                        <th className="th-price">Price <button className = "but" onClick={this.PriceSort}>{this.state.priceDir}</button></th>
                        <th className="th-hoa">HOA <button className = "but" onClick={this.HOASort}>{this.state.hoaDir}</button></th>
                        <th className="th-hoa">DOM <button className = "but" onClick={this.DOMSort}>{this.state.domDir}</button></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.foundDatas && this.state.foundDatas.length > 0 ? (
                        this.state.foundDatas.map((item) => (
                        <tr key={item.DOM} className="item">
                            <td className="item-url">
                                <a href={item.Url}>
                                <BsFillHouseFill  />
                                </a>       
                            </td>
                            <td className="item-type">{item.Type}</td>
                            <td className="item-addr">{item.Address}</td>
                            <td className="item-opentime">{item.OpenTime}</td>
                            
                            <td className="item-remark">{item.Remarks.map((comm,index)=>{
                                return (<Badge pill bg="secondary">{index+1}. {comm}</Badge>)
                            })}</td>
                            
                            <td className="item-price">${item.Price}k</td>
                            <td className="item-HOA">${item.HOA}</td>
                            <td className="item-HOA">{item.DOM}</td>
                        </tr>
                        ))
                        ) : (
                        <h1>No results found!</h1>
                        )
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
    
   

}
