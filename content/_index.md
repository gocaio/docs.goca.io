---
title: "Goca"
date: 2019-03-13T22:12:12+01:00
draft: false
---

{{< figure src="/img/goca_banner.png" class="img-sm">}}


Goca is a FOCA fork written in Go, which is a tool used mainly to find metadata and hidden information in the documents its scans. These documents may be on web pages, and can be downloaded and analyzed with Goca.

It is capable of analyzing a wide variety of documents, with the most common being Microsoft Office, Open Office, or PDF files, although it also analyzes Adobe InDesign or SVG files, for instance.

These documents are searched for using search engines such as:

* Google
* Bing
* DuckDuckGo
* Yahoo
* Ask

Then downloads the documents and extracts the EXIF information from graphic files, and a complete analysis of the information discovered through the URL is conducted even before downloading the file.

# About Goca&copy; Scanner

GOCA&copy; (**G**et **O**rganizations with **C**ollected **A**rchives) is a tool used mainly to find metadata and hidden information in documents found in open sources. Those documents are mainly on web pages, and they ara downloaded and analyzed with GOCA&copy;.

GOCA&copy; is capable of analyzing a wide variety of documents, with the most common being Microsoft Office, Open Office, or PDF files.

Documents are searched for using three possible search engines: `Google`, `Bing`, and `DuckDuckGo`. Using those engines GOCA&copy; adquieres lots of documents that helps GOCA&copy; to extract its metadata building up a huge profile about the target. Furthermore GOCA&copy; can perform the same analysis from a local bunch of files.

In terms to build a complete profile from all data extracted from all files, GOCA&copy; matches information in an attempt to identify which documents have been created by the same team and what servers and clients may be infered from them.

***

# About this project

This project has no intention on damaging the [FOCA](https://github.com/ElevenPaths/FOCA) project, developed and mantained by [Eleven Paths](https://www.elevenpaths.com).

This is a fork written in Go with the only intention of enjoy developing a new tool and make it portable to other distributions without dependencies of any kind to build it.

The logo of GOCA&copy; is just a modification of the old FOCA logo with the [Golang Gopher](https://blog.golang.org/gopher) face. The original Gopher was designed by [Renee French](https://reneefrench.blogspot.com).