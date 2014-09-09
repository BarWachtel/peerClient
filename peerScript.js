
var NS = {
    peerMe: null,
    userName: null,
    userId: null,
    peerId: null,
    peerConn: null

};

$(function() {
    console.log('inside jQuery onload function');

    $('#regButton').click(registerPeer);
    $('#connButton').click(connectToPeer);
    $('#sendButton').click(sendData);

    disable($('#regButton'), false);
    disable($('#connButton'), true);
    disable($('#sendButton'), true);
});

function registerPeer() {
    console.log('inside registerPeer function');
    NS.userName = $('#nameTextField').val() || '';
    if (NS.userName !== '') {
        $('#userId').html('User ID: ' + NS.userName);
        NS.peerMe = new Peer(NS.userName, {key: 'bfm6b7kbi221emi', debug: 3});

        NS.peerMe.on('open', function(id) {
            console.log('Peer opened');
            NS.userId = id;
            listenForPeerConnection();

            disable($('#connButton'), false);
            disable($('#regButton'), true);
        });


    } else {
        disable($('#regButton'), false);
        alert('Please choose an ID');
    }
}

function connectToPeer() {
    NS.peerId = $('#peerIdTextField').val() || '';
    if (NS.peerId !== '') {
        NS.peerConn = NS.peerMe.connect(NS.peerId);
        NS.peerConn.on('data', dataRecieved);
        disable($('#connButton'), true);
        disable($('#sendButton'), false);
    }
}

function listenForPeerConnection() {
    NS.peerMe.on('connection', function(conn) {
        console.log('inside listenForPeerConnection, connection event occured');

        NS.peerConn = conn;
        NS.peerConn.on('data', dataRecieved);

        disable($('#connButton'), true);
        disable($('#connButton'), true);
        disable($('#sendButton'), false);
    });
}

function dataRecieved(data) {
    console.log('inside dataRecieved');
    $('#msgOl').append('<li>' + data + '</li>');
}

function sendData() {
    console.log('inside sendData, msg sent: ' + $('#messageTextField').val());
    NS.peerConn.send($('#messageTextField').val());
    $('#messageTextField').val('');
}

function disable($object, arg) {
    $object.attr('disabled', arg);
}