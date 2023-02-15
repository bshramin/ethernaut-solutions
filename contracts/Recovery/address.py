def rlp_encode(input):
    if isinstance(input, str):
        if len(input) == 1 and ord(input) < 0x80:
            return input
        else:
            return encode_length(len(input), 0x80) + input
    elif isinstance(input, list):
        output = ''
        for item in input:
            output += rlp_encode(item)
        return encode_length(len(output), 0xc0) + output


def encode_length(L, offset):
    if L < 56:
        return chr(L + offset)
    elif L < 256**8:
        BL = to_binary(L)
        return chr(len(BL) + offset + 55) + BL
    else:
        raise Exception("input too long")


def to_binary(x):
    if x == 0:
        return ''
    else:
        return to_binary(int(x / 256)) + chr(x % 256)


RECOVERY_CONTRACT_ADDRESS = ""

print("0x"+rlp_encode(["Ce85503De9399D4dECa3c0b2bb3e9e7CFCBf9C6B".decode(
    'hex'), "01".decode('hex')]).encode('hex'))
