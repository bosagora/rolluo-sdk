/**
 *  Test of Transaction
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { BigNumber, Wallet } from "ethers";
import { hashFull, Transaction } from "../src";

import * as assert from "assert";

describe("Transaction", () => {
    const signer1 = new Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
    const signer2 = new Wallet("0x023beec95e3e47cb5b56bb8b5e4357db4b8565aef61eaa661c11ebbac6a6c4e8");

    // The test codes below compare with the values calculated in Agora.
    it("Test for hash value of transaction data", async () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigNumber.from(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );
        await tx.sign(signer1);

        assert.strictEqual(
            hashFull(tx).toString(),
            "0x42bbb0aac4c177696e2033b6d86d7b97de326f2c82e4b3d7f62f3c066ce55240"
        );
    });

    it("Test for Transaction.clone()", async () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigNumber.from(123),
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
            BigNumber.from(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0x0e1a3c5fe025577c1992b1cee5fffd1f0e32ce8a31a833ca3aac94e83bc232e42cd18c0f1ac17860be263066db51bd146d660248406896938c8028cf36b0142e1c"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));
        assert.ok(tx.verify());

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0x3afb2084076819473989e338c441e17fc9555175761dbb0ea51dfb34d87f4b8463954f69853992574cf2719b58de373765efd2bbeec8d533654eb5f61c2b38d61c"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
        assert.ok(tx.verify());
    });
});
