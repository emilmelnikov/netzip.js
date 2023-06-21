from pathlib import Path
from zipfile import ZipFile, ZipInfo


def main():
    datadir = Path(__file__).parent / "data"

    with ZipFile(datadir / "small.zip", mode="w") as zf:
        zf.comment = b"smol comment"

        hello = ZipInfo("hello.txt")
        hello.comment = b"optimistic comment"
        zf.writestr(hello, b"Hello World!")

        cafe = ZipInfo("nested/drink.bin")
        cafe.comment = b"energetic comment"
        zf.writestr(cafe, b"\xca\xfe\xba\xbe")

    with ZipFile(datadir / "zip64.zip", mode="w") as zf:
        for i in range(0x10000):
            zf.writestr(f"drink-{i:04x}.txt", b"\xca\xfe\xba\xbe")


if __name__ == "__main__":
    main()
