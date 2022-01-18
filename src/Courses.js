import React, { Component } from 'react';

class Courses extends Component {
    state = {
        courses: []
    }
    componentDidMount() {
        fetch("/course", {
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
        }).then(response => {
            if (response.ok) return response.json();
            throw new Error("Network response not ok")
        }).then(response => this.setState({ courses: response.courses })
            .catch(error => this.setState({ message: error.message }))

        )
    }
    render() {
        return (
            <p>{this.state.courses.map(courses => {
                return <li key={courses.id}> {courses.title}</li>
            })}</p>
        );
    }
}

export default Courses;