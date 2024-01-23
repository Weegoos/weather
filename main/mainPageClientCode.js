new Vue({
    el: '.container',
    data: {
        server: '',
        city: ""
    },
    mounted: function (){
        fetch('/api/data')
            .then (res => res.json())
            .then(data => {
                this.server = data.message
            })
            .catch(err => {
                console.log(err);
            })
    },
    methods: {
        getTheNameOfTheCity: function () {
            localStorage.setItem('localCity', this.city)
            location.reload()
        }
    }
    
    
})
