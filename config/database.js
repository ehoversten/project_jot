if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://ehoversten:Skittl3$25@ds233769.mlab.com:33769/project-jot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/project_idea_dev'}
}