// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GameRecords is Ownable (msg.sender){
    struct Player {
        uint highestScore;
        mapping(string => bool) achievements;
    }

    mapping(address => Player) public playerInfo;

    event ScoreUpdated(address indexed player, uint newScore);
    event AchievementUpdated(address indexed player, string achievement);

    function updateScore(address _player, uint _score) public onlyOwner {
        require(_score > playerInfo[_player].highestScore, "New score must be higher than the current score.");
        playerInfo[_player].highestScore = _score;
        emit ScoreUpdated(_player, _score);
    }

    function setAchievement(address _player, string memory _achievementName, bool _status) public onlyOwner {
        playerInfo[_player].achievements[_achievementName] = _status;
        emit AchievementUpdated(_player, _achievementName);
    }

    function hasAchieved(address _player, string memory _achievementName) public view returns (bool) {
        return playerInfo[_player].achievements[_achievementName];
    }

    // New getter function for highestScore
    function getHighestScore(address _player) public view returns (uint) {
        return playerInfo[_player].highestScore;
    }
}
