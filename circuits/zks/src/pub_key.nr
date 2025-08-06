use dep::std::ecdsa_secp256k1::verify_signature;
use dep::std::hash::keccak256;

global KEY_PART_LENGTH: u32 = 32;
global KEY_LENGTH: u32 = KEY_PART_LENGTH * 2;
global ADDRESS_LENGTH: u32 = 20;
global MESSAGE_LENGTH: u32 = 32;

pub struct PubKey {
    x: [u8; KEY_PART_LENGTH],
    y: [u8; KEY_PART_LENGTH],
}

impl PubKey {
    pub fn new(x: [u8; KEY_PART_LENGTH], y: [u8; KEY_PART_LENGTH]) -> PubKey {
        PubKey { x, y }
    }

    pub fn from_flattened(flattened: [u8; KEY_LENGTH]) -> PubKey {
        let mut x: [u8; KEY_PART_LENGTH] = [0; KEY_PART_LENGTH];
        for i in 0..KEY_PART_LENGTH {
            x[i] = flattened[i];
        }

        let mut y: [u8; KEY_PART_LENGTH] = [0; KEY_PART_LENGTH];
        for i in 0..KEY_PART_LENGTH {
            y[i] = flattened[KEY_PART_LENGTH + i];
        }

        PubKey::new(x, y)
    }

    pub fn get_address(self) -> [u8; ADDRESS_LENGTH] {
        let hash = keccak256(self.flatten(), KEY_LENGTH);

        let mut address = [0; ADDRESS_LENGTH];
        for i in 12..KEY_LENGTH {
            address[i - 12] = hash[i];
        }
        address
    }

    pub fn flatten(self) -> [u8; KEY_LENGTH] {
        let mut flat = [0; KEY_LENGTH];
        for i in 0..KEY_PART_LENGTH {
            flat[i] = self.x[i];
            flat[KEY_PART_LENGTH + i] = self.y[i];
        }
        flat
    }

    pub fn verify_flatten_signature(
        self,
        signature: [u8; KEY_LENGTH],
        message: [u8; MESSAGE_LENGTH],
    ) -> bool {
        verify_signature(self.x, self.y, signature, message)
    }
}
