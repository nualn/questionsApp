import * as statisticsService from "../../services/statisticsService.js";

const listStats = async ({ render, state }) => {
    const user = await state.session.get("user");
    let data = {};
    
    if (user) {
        data = await statisticsService.getUserStatistics(user.id);
    } 

    const topFive = await statisticsService.getTopFive();
    data.topFive = topFive;
    
    render("statistics.eta", data);
};

export {listStats};