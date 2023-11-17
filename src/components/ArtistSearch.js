import React, { Component } from 'react'
import axios from 'axios'

class ArtistSearch extends Component {
    constructor(props) {
        super(props)
        this.state = { artists: [], }
        this.cancelToken = ''
        this.onIptClick = this.onIptClick.bind(this)
        this.node = React.createRef()
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.onIptClick)
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onIptClick)
    }
    onIptClick = (e) => {
        if (this.node.current.contains(e.target)) { return }
        this.setState({ artists: [], })
    }
    onLsChange = async (e) => {
        if (this.isReqToken) {
            this.isReqToken.cancel()
        }
        this.isReqToken = axios.CancelToken.source()
            await axios.get('http://localhost:9098/api/user', {
            isReqToken: this.isReqToken.token,
        }).then((res) => {
            this.setState({ artists: res.data, })
        }).catch((error) => {
            if (axios.isCancel(error) || error) {
                console.log('Could not get')
            }
        })
        let filterSearch = e.target.value.toLowerCase()
        let searchRes = this.state.artists.filter((e) => {
            let finalRes = e.title.toLowerCase()
            return finalRes.indexOf(filterSearch) !== -1
        })
        this.setState({ artists: searchRes, })
    }
    render() {
        return (
            <div className="searchModule">
                <input onClick={this.onIptClick} onChange={this.onLsChange}
                    type="text" placeholder="Search artists ..." ref={this.node}
                />
                <ul>
                    {this.state.artists.map((res) => { return <li key={res.id}>{res.username}</li> })}
                </ul>
            </div>
        )
    }
}

export default ArtistSearch
