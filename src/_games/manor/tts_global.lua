local Decker = {}

-- provide unique ID starting from 20 for present decks
local nextID, recheckNextID
do
    local _nextID = 20
    nextID = function()
        _nextID = _nextID + 1
        return tostring(_nextID)
    end

    local function recheckObjNextDeckID(obj)
        for deckID in pairs(obj.getData().CustomDeck or {}) do
            if deckID >= _nextID then
                _nextID = deckID
            end
        end
    end

    recheckNextID = function()
        local initialNextID = _nextID
        for _, obj in ipairs(getAllObjects()) do
            recheckObjNextDeckID(obj)
        end
        return _nextID > initialNextID
    end
end

-- Asset signature (equality comparison)
local function assetSignature(assetData)
    return table.concat({
        assetData.FaceURL,
        assetData.BackURL,
        assetData.NumWidth,
        assetData.NumHeight,
        assetData.BackIsHidden and 'hb' or '',
        assetData.UniqueBack and 'ub' or ''
    })
end
-- Asset ID storage to avoid new ones for identical assets
local idLookup = {}
local function assetID(assetData)
    local sig = assetSignature(assetData)
    local key = idLookup[sig]
    if not key then
        key = nextID()
        idLookup[sig] = key
    end
    return key
end

local assetMeta = {
    deck = function(self, cardNum, options)
        return Decker.AssetDeck(self, cardNum, options)
    end
}
assetMeta = {__index = assetMeta}

-- Create a new CustomDeck asset
function Decker.Asset(face, back, options)
    local asset = {}
    options = options or {}
    asset.data = {
        FaceURL = face or error('Decker.Asset: faceImg link required'),
        BackURL = back or error('Decker.Asset: backImg link required'),
        NumWidth = options.width or 1,
        NumHeight = options.height or 1,
        BackIsHidden = options.hiddenBack or false,
        UniqueBack = options.uniqueBack or false
    }
    -- Reuse ID if asset existing
    asset.id = assetID(asset.data)
    return setmetatable(asset, assetMeta)
end
-- Pull a Decker.Asset from card JSONs CustomDeck entry
local function assetFromData(assetData)
    return setmetatable({data = assetData, id = assetID(assetData)}, assetMeta)
end

-- Create a base for JSON objects
function Decker.BaseObject()
    return {
        Name = 'Base',
        Transform = {
            posX = 0, posY = 5, posZ = 0,
            rotX = 0, rotY = 0, rotZ = 0,
            scaleX = 1, scaleY = 1, scaleZ = 1
        },
        Nickname = '',
        Description = '',
        Value = 0,
        Tags = {},
        ColorDiffuse = { r = 1, g = 1, b = 1 },
        Locked = false,
        Grid = true,
        Snap = true,
        Autoraise = true,
        Sticky = true,
        Tooltip = true,
        GridProjection = false,
        Hands = true,
        XmlUI = '',
        LuaScript = '',
        LuaScriptState = '',
        GUID = 'deadbf'
    }
end
-- Typical paramters map with defaults
local commonMap = {
    name   = {field = 'Nickname',    default = ''},
    value   = {field = 'Value',    default = 0},
    tags   = {field = 'Tags',   default = {}},
    desc   = {field = 'Description', default = ''},
    script = {field = 'LuaScript',   default = ''},
    xmlui  = {field = 'XmlUI',       default = ''},
    scriptState = {field = 'LuaScriptState', default = ''},
    locked  = {field = 'Locked',  default = false},
    tooltip = {field = 'Tooltip', default = true},
    guid    = {field = 'GUID',    default = 'deadbf'},
    hands   = {field = 'Hands',   default = true},
}
-- Apply some basic parameters on base JSON object
function Decker.SetCommonOptions(obj, options)
    options = options or {}
    for k,v in pairs(commonMap) do
        -- can't use and/or logic cause of boolean fields
        if options[k] ~= nil then
            obj[v.field] = options[k]
        else
            obj[v.field] = v.default
        end
    end
    -- passthrough unrecognized keys
    for k,v in pairs(options) do
        if not commonMap[k] then
            obj[k] = v
        end
    end
end
-- default spawnObjectJSON/spawnObjectData params since it doesn't like blank fields
local function defaultParams(params)
    params = params or {}
    params.position = params.position or {0, 5, 0}
    params.rotation = params.rotation or {0, 0, 0}
    params.scale = params.scale or {1, 1, 1}
    if params.sound == nil then
        params.sound = true
    end
    return params
end

-- For copy method
local deepcopy
deepcopy = function(t)
    local copy = {}
    for k,v in pairs(t) do
       if type(v) == 'table' then
           copy[k] = deepcopy(v)
       else
           copy[k] = v
       end
    end
    return copy
end
-- meta for all Decker derived objects
local commonMeta = {
    -- return object JSON string, used cached if present
    _cache = function(self)
        if not self.json then
            self.json = JSON.encode(self.data)
        end
        return self.json
    end,
    -- invalidate JSON string cache
    _recache = function(self)
        self.json = nil
        return self
    end,
    spawn = function(self, params)
        params = defaultParams(params)
        params.data = self.data
        return spawnObjectData(params)
    end,
    spawnJSON = function(self, params)
        params = defaultParams(params)
        params.json = self:_cache()
        return spawnObjectJSON(params)
    end,
    copy = function(self)
        return setmetatable(deepcopy(self), getmetatable(self))
    end,
    setCommon = function(self, options)
        Decker.SetCommonOptions(self.data, options)
        return self
    end,
}
-- apply common part on a specific metatable
local function customMeta(mt)
    for k,v in pairs(commonMeta) do
        mt[k] = v
    end
    mt.__index = mt
    return mt
end

-- DeckerCard metatable
local cardMeta = {
    setAsset = function(self, asset)
        local cardIndex = self.data.CardID:sub(-2, -1)
        self.data.CardID = asset.id .. cardIndex
        self.data.CustomDeck = {[asset.id] = asset.data}
        return self:_recache()
    end,
    getAsset = function(self)
        local deckID = next(self.data.CustomDeck)
        return assetFromData(self.data.CustomDeck[deckID])
    end,
    -- reset deck ID to a consistent value script-wise
    _recheckDeckID = function(self)
        local oldID = next(self.data.CustomDeck)
        local correctID = assetID(self.data.CustomDeck[oldID])
        if oldID ~= correctID then
            local cardIndex = self.data.CardID:sub(-2, -1)
            self.data.CardID = correctID .. cardIndex
            self.data.CustomDeck[correctID] = self.data.CustomDeck[oldID]
            self.data.CustomDeck[oldID] = nil
        end
        return self
    end
}
cardMeta = customMeta(cardMeta)
-- Create a DeckerCard from an asset
function Decker.Card(asset, row, col, options)
    row, col = row or 1, col or 1
    options = options or {}
    local card = Decker.BaseObject()
    card.Name = 'Card'
    -- optional custom fields
    Decker.SetCommonOptions(card, options)
    if options.sideways ~= nil then
        card.SidewaysCard = options.sideways
        -- FIXME passthrough set that field, find some more elegant solution
        card.sideways = nil
    end
    -- CardID string is parent deck ID concat with its 0-based index (always two digits)
    local num = (row-1)*asset.data.NumWidth + col - 1
    num = string.format('%02d', num)
    card.CardID = asset.id .. num
    -- just the parent asset reference needed
    card.CustomDeck = {[asset.id] = asset.data}

    local obj = setmetatable({data = card}, cardMeta)
    obj:_recache()
    return obj
end


-- DeckerDeck meta
local deckMeta = {
    count = function(self)
        return #self.data.DeckIDs
    end,
    -- Transform index into positive
    index = function(self, ind)
        if ind < 0 then
            return self:count() + ind + 1
        else
            return ind
        end
    end,
    swap = function(self, i1, i2)
        local ri1, ri2 = self:index(i1), self:index(i2)
        assert(ri1 > 0 and ri1 <= self:count(), 'DeckObj.rearrange: index ' .. i1 .. ' out of bounds')
        assert(ri2 > 0 and ri2 <= self:count(), 'DeckObj.rearrange: index ' .. i2 .. ' out of bounds')
        self.data.DeckIDs[ri1], self.data.DeckIDs[ri2] = self.data.DeckIDs[ri2], self.data.DeckIDs[ri1]
        local co = self.data.ContainedObjects
        co[ri1], co[ri2] = co[ri2], co[ri1]
        return self:_recache()
    end,
    -- rebuild self.data.CustomDeck based on contained cards
    _rescanUsedDecks = function(self)
        local cardIDs = {}
        for k,card in ipairs(self.data.ContainedObjects) do
            local cardID = next(card.CustomDeck)
            if not cardIDs[cardID] then
                cardIDs[cardID] = card.CustomDeck[cardID]
            end
        end
        -- eeh, GC gotta earn its keep as well
        -- FIXME if someone does shitton of removals, may cause performance issues?
        self.data.CustomDeck = cardIDs
    end,
    -- rebuild self.data.DeckIDs based on contained cards
    _rescanDeckIDs = function(self)
        local deckIDs = {}
        for _, card in ipairs(self.data.ContainedObjects) do
            table.insert(deckIDs, card.CardID)
        end
        self.data.DeckIDs = deckIDs
    end,
    remove = function(self, ind, skipRescan)
        local rind = self:index(ind)
        assert(rind > 0 and rind <= self:count(), 'DeckObj.remove: index ' .. ind .. ' out of bounds')
        local card = self.data.ContainedObjects[rind]
        table.remove(self.data.DeckIDs, rind)
        table.remove(self.data.ContainedObjects, rind)
        if not skipRescan then
            self:_rescanUsedDecks()
        end
        return self:_recache()
    end,
    removeMany = function(self, ...)
        local indices = {...}
        table.sort(indices, function(e1,e2) return self:index(e1) > self:index(e2) end)
        for _,ind in ipairs(indices) do
            self:remove(ind, true)
        end
        self:_rescanUsedDecks()
        return self:_recache()
    end,
    insert = function(self, card, ind)
        ind = ind or (self:count() + 1)
        local rind = self:index(ind)
        assert(rind > 0 and rind <= (self:count()+1), 'DeckObj.insert: index ' .. ind .. ' out of bounds')
        table.insert(self.data.DeckIDs, rind, card.data.CardID)
        table.insert(self.data.ContainedObjects, rind, card.data)
        local id = next(card.data.CustomDeck)
        if not self.data.CustomDeck[id] then
            self.data.CustomDeck[id] = card.data.CustomDeck[id]
        end
        return self:_recache()
    end,
    reverse = function(self)
        local s,e = 1, self:count()
        while s < e do
            self:swap(s, e)
            s = s+1
            e = e-1
        end
        return self:_recache()
    end,
    sort = function(self, sortFunction)
        table.sort(self.data.ContainedObjects, sortFunction)
        self:_rescanDeckIDs()
        return self:_recache()
    end,
    cardAt = function(self, ind)
        local rind = self:index(ind)
        assert(rind > 0 and rind <= (self:count()+1), 'DeckObj.insert: index ' .. ind .. ' out of bounds')
        local card = setmetatable({data = deepcopy(self.data.ContainedObjects[rind])}, cardMeta)
        card:_recache()
        return card
    end,
    switchAssets = function(self, replaceTable)
        -- destructure replace table into
        -- [ID_to_replace] -> [ID_to_replace_with]
        -- [new_asset_ID] -> [new_asset_data]
        local idReplace = {}
        local assets = {}
        for oldAsset, newAsset in pairs(replaceTable) do
            assets[newAsset.id] = newAsset.data
            idReplace[oldAsset.id] = newAsset.id
        end
        -- update deckIDs
        for k,cardID in ipairs(self.data.DeckIDs) do
            local deckID, cardInd = cardID:sub(1, -3), cardID:sub(-2, -1)
            if idReplace[deckID] then
                self.data.DeckIDs[k] = idReplace[deckID] .. cardInd
            end
        end
        -- update CustomDeck data - nil replaced
        for replacedID in pairs(idReplace) do
            if self.data.CustomDeck[replacedID] then
                self.data.CustomDeck[replacedID] = nil
            end
        end
        -- update CustomDeck data - add replacing
        for _,replacingID in pairs(idReplace) do
            self.data.CustomDeck[replacingID] = assets[replacingID]
        end
        -- update card data
        for k,cardData in ipairs(self.data.ContainedObjects) do
            local deckID = next(cardData.CustomDeck)
            if idReplace[deckID] then
                cardData.CustomDeck[deckID] = nil
                cardData.CustomDeck[idReplace[deckID]] = assets[idReplace[deckID]]
            end
        end
        return self:_recache()
    end,
    getAssets = function(self)
        local assets = {}
        for id,assetData in pairs(self.data.CustomDeck) do
            assets[#assets+1] = assetFromData(assetData)
        end
        return assets
    end
}
deckMeta = customMeta(deckMeta)
-- Create DeckerDeck object from DeckerCards
function Decker.Deck(cards, options)
    assert(#cards > 1, 'Trying to create a Decker.deck with less than 2 cards')
    local deck = Decker.BaseObject()
    deck.Hands = false
    deck.Name = 'Deck'
    Decker.SetCommonOptions(deck, options)
    deck.DeckIDs = {}
    deck.CustomDeck = {}
    deck.ContainedObjects = {}
    for _,card in ipairs(cards) do
        deck.DeckIDs[#deck.DeckIDs+1] = card.data.CardID
        local id = next(card.data.CustomDeck)
        if not deck.CustomDeck[id] then
            deck.CustomDeck[id] = card.data.CustomDeck[id]
        end
        deck.ContainedObjects[#deck.ContainedObjects+1] = card.data
    end

    local obj = setmetatable({data = deck}, deckMeta)
    obj:_recache()
    return obj
end
-- Create DeckerDeck from an asset using X cards on its sheet
function Decker.AssetDeck(asset, cardNum, options)
    cardNum = cardNum or asset.data.NumWidth * asset.data.NumHeight
    local row, col, width = 1, 1, asset.data.NumWidth
    local cards = {}
    for k=1,cardNum do
        cards[#cards+1] = Decker.Card(asset, row, col)
        col = col+1
        if col > width then
            row, col = row+1, 1
        end
    end
    return Decker.Deck(cards, options)
end

Decker.RescanExistingDeckIDs = recheckNextID

----------------------------------------------
-----------------CUSTOM CODE------------------
----------------------------------------------

gameName = "manor"
gameVersion = "1.2"

-- Check if string begins with the argument (no regex)
string.beginswith = function(str, prefix)
    return (str:sub(1, prefix:len()) == prefix)
end
string.startswith = string.beginswith

-- Two globals to persist state:
-- one for the Decker.Assets (1 for each page of 70 cards). This is saved and loaded.
allAssets = {}
-- and one for the Classic Deck. This is not saved, it's too big and makes the mod crash.
classicDeck = {}

function apiUrl()
    return 'https://brandeck.herokuapp.com/api/tts/' .. gameName .. '/' .. gameVersion
end
function decksUrl()
    return apiUrl() .. '/decks'
end
function sheetsUrl()
    return apiUrl() .. '/sheets'
end


function makeAssets(args)
    -- Width or height must be less than 10k pixels
    local width = 10
    local height = 7
    -- Hardcoded for Crosley Manor (intended Action back)
    local cardBack = 'https://drive.google.com/uc?export=download&id=' .. '1Dc0lTStzqB7fix3Rsn3QpVp2ZX5UqdW9'

    local assets = {}
    for page, entry in ipairs(args) do
        local cardFaces = 'https://drive.google.com/uc?export=download&id=' .. entry.fileId
        local pageAsset = Decker.Asset(cardFaces, cardBack, {width = width, height = height, name = "classic page "..page, hiddenBack = true})
        assets[page] = {numCards = entry.count, asset = pageAsset}
    end
    return assets
end

-- Make a Decker.Deck by pulling cards from the Classic deck based on the decklist
function buildDeck(decklist, options)
    local cards = {}
    local options = options or {}
    -- the entry.id has to correspond to the index of the "classic deck" which is 1-indexed
    -- the +1 is because we were probably returning the "id" 0-indexed
    for idx, entry in ipairs(decklist) do
        for i=1,entry.qty do
            cards[#cards+1] = classicDeck:cardAt(tonumber(entry.id)+1):setCommon(options)
        end
    end

    return Decker.Deck(cards, options)
end

-- If the list is just 1-indexed indices and already in correct quantities 
function buildDeckSimple(list, options)
    local cards = {}
    local options = options or {}
    for _, cardIdx in ipairs(list) do
        cards[#cards+1] = classicDeck:cardAt(tonumber(cardIdx)):setCommon(options)
    end
    return Decker.Deck(cards, options)
end

-- Make a Decker.Deck based on allAssets
function makeClassic()
    local allCards = {}
    for page, asset in ipairs(allAssets) do
        local pageDeck = Decker.AssetDeck(asset.asset, asset.numCards, {})
        for idx, _ in pairs(pageDeck.data.ContainedObjects) do
            local card = pageDeck:cardAt(idx)
            allCards[#allCards+1] = card
        end
    end
    return Decker.Deck(allCards, {})
end

-- Chat Command Functions
-- Manually reset allAssets and classicDeck
function updateClassic(args, player)
    printToAll("Updating the assets...")
    allAssets = makeAssets(args)

    printToAll("Updating Classic Deck...")
    classicDeck = makeClassic()

    printToAll("Spawning Classic Deck for convenience (use "..chatCommandPrefix.."spawn.classic to just get fresh copies)")
    spawnClassic({}, player)
end

-- Use the brandeck API to reset allAssets and classicDeck
function autoUpdateClassic(args, player)
    local url = sheetsUrl()
    printToAll("Reading the latest sheets from Brandeck...")
    function callback(webReturn)
        local parsed = JSON.decode(webReturn.text)
        for page, entry in ipairs(parsed) do printToAll("Page "..page..": "..entry.fileId .. " Count: ".. entry.count) end
        updateClassic(parsed, player)
    end

    WebRequest.get(url, callback)
end

-- Do vector math to get a location in about the middle of the player's play area
function getSpawnLocation(player)
    local handZone = Player[player.color]:getHandTransform()
    local spawnLocation = handZone['position'] + handZone['forward'] * 10
    return {spawnLocation.x, spawnLocation.y, spawnLocation.z}
end
-- red: 0,0,1  -27, 4, -21
-- green 0,0,1 -26, 4, 23
-- blue 0,0,1, 33, 4, 23
-- white 0,0,1 31, 4, -21
function getSpawnRotation(player)
    local handZone = Player[player.color]:getHandTransform()
    if(handZone['position'].z < 0) then
        return {0, 180, 180} -- white/red
    else
        return {0, 0, 180} -- green/blue
    end
end

-- Spawn the currently built copy of classic
function spawnClassic(args, player)
    local spawnLocation = getSpawnLocation(player)
    local spawnRotation = getSpawnRotation(player)
    classicDeck:spawn({position = spawnLocation, rotation = spawnRotation})
    printToAll("New copy of Classic spawned!")
end

-- Given a deck name, request JSON and spawn the deck based on that JSON
-- function spawnDeck(args, player)
--     local deckFileId = args[1]
--     local url = "https://skypirate-deckgen.herokuapp.com/api/decks/"..deckFileId

--     function callback(webReturn)
--         local parsed = JSON.decode(webReturn.text)
--         -- {cards: {qty:number, id:?}[], name: string}
--         -- 
--         local newDeck = buildDeck(parsed["cards"], {name = parsed["name"]})
--         printToAll(parsed["name"].." fetched and built.", Color.fromString(player.color))
--         local spawnLocation = getSpawnLocation(player)
--         local spawnRotation = getSpawnRotation(player)
--         newDeck:spawn({position = spawnLocation, rotation = spawnRotation})
--         printToAll(parsed["name"].." spawned!", Color.fromString(player.color))
--     end

--     WebRequest.get(url, callback)
-- end

function spawnPresetDecks(args, player)
    local url = decksUrl()
    function callback(webReturn)
        local parsed = JSON.decode(webReturn.text)
        local decks = parsed["decks"] -- {name:string, cards:number[]}[]
        for i, deck in ipairs(decks) do
            local deckName = deck["name"]
            local built = buildDeckSimple(deck["cards"], {name = deckName})
            printToAll(deckName.." fetched and built.", Color.fromString(player.color))
            local spawnLocation = Tables.getTableObject().getPosition()
            local spawnRotation = getSpawnRotation(player)
            local offset = ((i - 1) * 2.5)
            local spawnWithOffset = {spawnLocation[1] + offset, spawnLocation[2], spawnLocation[3]}
            built:spawn({position = spawnWithOffset, rotation = spawnRotation})
            printToAll(deckName.." spawned!", Color.fromString(player.color))
        end
    end
    WebRequest.get(url, callback)
end


-- Display help text to the player who asked for it.
function help(args, player)
    printToColor("HELP:", player.color)
    for cmdName,cmd in pairs(chatCommands) do
        printToColor("---", player.color)
        printToColor(chatCommandPrefix..cmdName.." "..cmd.description, player.color)
    end
end

-- Used for testing
function echo(args, player)
    for _, v in pairs(args) do printToColor(v, player.color) end
end

-- Event Handlers
chatCommandPrefix = "."
chatCommandArgDelimiter = " "
chatCommands =  {
    ["spawn.classic"] = { func = spawnClassic, description = "-> Spawns a Classic deck." },
    -- ["spawn.deck"] = { func = spawnDeck, description = "DeckId".." -> Spawns a deck based on deck id from DeckGen server." },
    ["spawn.preset"] = { func = spawnPresetDecks, description = "-> Spawns all preset decks." },
    ["update.manual"] = { func = updateClassic, description = "pageOneFileId"..chatCommandArgDelimiter.."pageTwoFileId -> Update cached Classic set." },
    ["update"] = { func = autoUpdateClassic, description = "-> Update cached Classic set based on " .. sheetsUrl()},
    ["help"] = { func = help, description = "-> This list of descriptions." },
    ["echo"] = { func = echo, description = "hi"..chatCommandArgDelimiter.."you".." -> hi\nyou" },
}

function onChat(msg, player)
    -- parse command if it begins with control char
    if(string.beginswith(msg, chatCommandPrefix)) then
        -- extract the command
        local cmdName, argString = msg:match("%"..chatCommandPrefix.."([^ ]*)[ ]?(.*)")

        -- get the function to run
        local command = chatCommands[cmdName]

        -- break the args (on comma) into a table of individual args
        local args = {}
        for word in argString:gmatch("[^%"..chatCommandArgDelimiter.."]+") do args[#args+1] = word end

        -- run the function
        if(command.func) then
            command.func(args, player)
        else
            printToColor("The command "..cmd.." is not recognized", player.color)
        end
        return false -- suppress the command from showing up in chat.
    end
end

-- Only save allAssets
function onSave()
    local saved_data = JSON.encode(allAssets)
    return saved_data
end

-- Load the persisted assets and make the Classic deck
function onLoad(saved_data)
    if saved_data ~= "" then
        printToAll("Classic assets loaded from save.")
        local loaded_data = JSON.decode(saved_data)
        printToAll("Classic assets parsed from JSON and set.")
        allAssets = loaded_data
        classicDeck = makeClassic()
        printToAll("Classic deck set. Mod ready!")
    else
        printToAll("Classic assets were not found in save. Run "..chatCommandPrefix.."update")
        allAssets = {}
    end
    broadcastToAll('Welcome to Crosley Manor on TTS! Use commands in chat. Type '..chatCommandPrefix..'help to see options.', {1, 1, 1})
end
