/**
 *  Test of Transaction
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import * as ethers from "ethers";
import { hashFull, Transaction } from "../src";

import * as assert from "assert";

describe("Transaction", () => {
    const signer1 = new ethers.Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
    const signer2 = new ethers.Wallet("0x023beec95e3e47cb5b56bb8b5e4357db4b8565aef61eaa661c11ebbac6a6c4e8");

    // The test codes below compare with the values calculated in Agora.
    it("Test for hash value of transaction data", async () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );
        await tx.sign(signer1);

        assert.strictEqual(
            hashFull(tx).toString(),
            "0xa2f2795ea841f6d9005fe047ee8aa6ae8a106d2675b9b88e3bd4d6faf5044372"
        );
    });

    it("Test for Transaction.clone()", async () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );
        await tx.sign(signer1);

        const clone_tx = tx.clone();
        assert.deepStrictEqual(tx, clone_tx);
    });

    it("Test for Transaction.sign() & verify", async () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0x64ca000fe0fbb7ca96274dc836e3b286863b24fc47576748f0945ce3d07f58ed47f2dda151cbc218d05de2d2363cef6444ab628670d2bc9cf7674862e6dc51c81b"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));
        assert.ok(tx.verify());

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0x8a65d1c86d40a468a428d8ade17a795b49c0fc4356159d7208af97d19206f59766f7adbf1a348605d58c0a564098d805b0934e131343d45554b7d54501a83b0d1c"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
        assert.ok(tx.verify());
    });
});
