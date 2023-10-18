const blogOne = async (req, res) => {
    res.send('Blog One');
}

const blogTwo = async (req, res) => {
    res.send('Blog Two');
}

const blogSetup = async (req, res) => {
    res.send('Blog Setup');
}

module.exports = {
    blogOne,
    blogTwo,
    blogSetup
}

