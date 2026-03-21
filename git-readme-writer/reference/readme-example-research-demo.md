# Research / Demo README 範例

## When to Use

- repository 用於論文實作、模型展示、benchmark、prototype demo。
- 讀者主要關心如何重現結果，以及資料、模型、指標放在哪。

## Reader Focus

- researchers：如何 setup、如何 reproduce、有哪些 datasets / checkpoints。
- evaluators：結果、限制、demo links。

## What to Highlight

- setup and reproduction steps
- datasets / models / checkpoints
- results summary
- citation and attribution

## Example Skeleton

~~~markdown
# motion-diffusion-demo

一個重現 motion diffusion paper 結果的研究型 repository。

## Setup

```bash
conda create -n motion-demo python=3.11
pip install -r requirements.txt
```

## Reproduce

```bash
python train.py --config configs/base.yaml
python eval.py --checkpoint checkpoints/best.pt
```

## Datasets

- HumanML3D
- KIT Motion-Language

## Results

主要結果與 ablation 見 `docs/results.md`。

## Citation

若本專案對你有幫助，請引用原始 paper。
~~~

## Variation Notes

- 若 repo 只提供 demo，不一定需要完整 `Training` 步驟，但要寫清楚限制。
- 若 dataset 不能公開，可補 `Access Policy` 或 `Request Access`。
- 若是 benchmark repo，可加 `Result Table` 與 `Evaluation Protocol`。
